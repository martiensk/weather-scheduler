/**
 * @file This file contains the jobs service.
 */
import { getCache, setCache } from '../repositories/cacheRepository';
import { ECacheKeys } from '../enums/cacheKeys.enum';
import { IWeatherCurrent } from 'shared-lib/src/interfaces/weather.interfaces';
import { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';
import { getWeather } from '../repositories/weatherRepository';
import { getAllScheduledJobs } from './schedulerService';
import { sendMessage } from './socketService';
import { EJobType } from 'shared-lib/src/enums/jobs.enums';

/**
 * Retrieves all scheduled job details and their last run history from cache.
 * @returns {IScheduledJob[]} An array of scheduled job details with their last run history.
 */
export const getAllJobDetails = async() => {
  const allJobs = await getAllScheduledJobs();

  if(!allJobs) { return ([] as IScheduledJob[]); }
  allJobs.forEach((job) => {
    job.runs = [];
    if(job.type === EJobType.WEATHER) {
      const jobRunHistory =  getCache<IWeatherCurrent[]>(`${ECacheKeys.WEATHER_JOB}_${job.id}`);
      if(jobRunHistory && jobRunHistory.length > 0) {
        job.runs =  getCache<IWeatherCurrent[]>(`${ECacheKeys.WEATHER_JOB}_${job.id}`);
      }
    }
  });

  return allJobs;
};

/**
 * This function is responsible for running a scheduled job that fetches weather data for a specific location.
 * It retrieves historic weather data from cache, and updates it with the latest weather data for the location.
 * The updated weather data is then sent to the front-end via WebSocket.
 * @param {IScheduledJob} job - The scheduled job object containing the job details.
 */
export const weatherJob = async(job: IScheduledJob) => {
  console.log(`Running job ${job.id}`);
  // Get historic weathers from cache
  let cachedWeathers = getCache<IWeatherCurrent[]>(`${ECacheKeys.WEATHER_JOB}_${job.id}`);

  // Check if cache exists, if not, make it so.
  if(!cachedWeathers) {
    setCache(`${ECacheKeys.WEATHER_JOB}_${job.id}`, []);
    cachedWeathers = [];
  }

  // Check if we reached the max historic records and remove the oldest one if so.
  const maxRecords = Number(process.env.WEATHER_MAX_HISTORY) || 10;
  if(cachedWeathers.length >= maxRecords) {
    cachedWeathers.shift();
  }

  // Get the weather for the location
  let weatherLookup: IWeatherCurrent | null = null;
  try {
    weatherLookup = await getWeather(job.details.location);
  } catch {
    console.log(`Job ${job.id} failed`);
    // Normally we would log the error here, but since we don't have a logger in this project, we'll just console.log it.
    return;
  }

  const weatherUpdateObj = {
    updated: new Date().toISOString(),
    location: {
      name: weatherLookup.location.name,
      region: weatherLookup.location.region,
      country: weatherLookup.location.country
    },
    current: {
      last_updated: weatherLookup.current.last_updated,
      temp_c: weatherLookup.current.temp_c,
      is_day: weatherLookup.current.is_day,
      condition: {
        text: weatherLookup.current.condition.text,
        icon: weatherLookup.current.condition.icon,
        code: weatherLookup.current.condition.code
      },
      wind_kph: weatherLookup.current.wind_kph,
      wind_degree: weatherLookup.current.wind_degree,
      wind_dir: weatherLookup.current.wind_dir,
      precip_mm: weatherLookup.current.precip_mm,
      humidity: weatherLookup.current.humidity,
      cloud: weatherLookup.current.cloud,
      feelslike_c: weatherLookup.current.feelslike_c,
      vis_km: weatherLookup.current.vis_km,
      uv: weatherLookup.current.uv,
      gust_kph: weatherLookup.current.gust_kph
    }
  };

  cachedWeathers.push(weatherUpdateObj);

  /**
   * There is a requirement for the last 10 API requests results to be accessible by the front-end.
   * There is no requirement for the data to be persisted, so we'll just keep it in memory cache.
   */

  // Update the cache
  setCache(`${ECacheKeys.WEATHER_JOB}_${job.id}`, cachedWeathers);

  /* 
   * Send the data to the front-end via WSS
   * I would prefer so send only the update here instead of all the historical data, 
   * but since we have a max of 10 records the footprint is small enough to send it all.
   * In a real world scenario I would send only the update and have the front-end request
   * the historical data if needed.
   */
  sendMessage(JSON.stringify({
    type: 'WEATHER_JOB_UPDATE',
    payload: {
      jobId: job.id,
      weathers: cachedWeathers
    }
  }));
  console.log(`Job ${job.id} completed`);

};