/**
 * @file This file contains the jobs service.
 */
import { getCache, setCache } from '../repositories/cacheRepository';
import { ECacheKeys } from '../enums/cacheKeys.enum';
import { IWeatherCurrent } from 'shared-lib/src/interfaces/weather.interfaces';
import { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';
import { getWeather } from './weatherService';
import { getAllScheduledJobs } from './schedulerService';

/**
 * Retrieves all scheduled job details and their last run history from cache.
 * @returns {IScheduledJob[]} An array of scheduled job details with their last run history.
 */
export const getAllJobDetails = async() => {
  const allJobs = await getAllScheduledJobs();

  if(!allJobs) { return ([] as IScheduledJob[]); }
  allJobs.forEach((job) => {
    const jobRunHistory = getCache<IWeatherCurrent[]>(`${ECacheKeys.WEATHER_JOB}_${job.id}`);
    let lastJobRun: IWeatherCurrent | undefined;
    if(jobRunHistory && jobRunHistory.length > 0) {
      lastJobRun = jobRunHistory[jobRunHistory.length - 1];
    }
    job.lastRun = lastJobRun;
  });

  return allJobs;
};

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
  const weatherLookup = await getWeather(job.details.location);

  cachedWeathers.push({
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
  });

  /**
   * There is a requirement for the last 10 API requests results to be accessible by the front-end.
   * There is no requirement for the data to be persisted, so we'll just keep it in memory cache.
   */

  // Update the cache
  setCache(`${ECacheKeys.WEATHER_JOB}_${job.id}`, cachedWeathers);
  console.log(`Job ${job.id} completed`);

  // TODO: Send the data to the front-end

};