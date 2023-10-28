/**
 * @file This file contains the scheduler service.
 */
import { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';
import { fetchAllJobs, insertJob } from '../repositories/dbRepository';
import { getCache, setCache } from '../repositories/cacheRepository';
import { ECacheKeys } from '../enums/cacheKeys.enum';
import { scheduleJob } from 'node-schedule';
import { EJobType } from 'shared-lib/src/enums/jobs.enums';
import { weatherJob } from './jobsService';

/**
 * Retrieves all scheduled jobs.
 * @returns {IScheduledJob[]} A promise that resolves to an array of scheduled jobs.
 */
export const getAllScheduledJobs = async() => {
  // Try grab from cache
  let allJobs: IScheduledJob[] = getCache<IScheduledJob[]>(ECacheKeys.SCHEDULED_JOBS);
  console.log(allJobs);
  if(!allJobs) {
    allJobs = await fetchAllJobs();
    setCache<IScheduledJob[]>(ECacheKeys.SCHEDULED_JOBS, allJobs);
  }
  return allJobs;
};

/**
 * Saves a scheduled job to the database and updates the cache with all scheduled jobs, then schedules it for execution.
 * @param {IScheduledJob} job - The scheduled job to be saved.
 * @returns {Promise<IScheduledJob[]>} A Promise that resolves when the job has been saved and the cache has been updated.
 */
export const saveJob = async(job: IScheduledJob) => {
  const jobId = await insertJob(job);
  job.id = jobId;
  const allJobs = await getAllScheduledJobs();
  setCache<IScheduledJob[]>(ECacheKeys.SCHEDULED_JOBS, [...allJobs, job]);
  scheduleAJob(job);
};

/**
 * Starts all scheduled jobs by fetching all jobs and scheduling each one.
 * @returns {Promise<void>}
 */
export const startScheduledJobs = async() => {
  const allJobs = await fetchAllJobs();
  allJobs.forEach((job) => {
    scheduleAJob(job);
  });
};

/**
 * Schedules a job based on its type.
 * @param {IScheduledJob} job - The job to be scheduled.
 */
export const scheduleAJob = (job: IScheduledJob) => {
  switch(job.type) {
  case EJobType.Weather:
    // Run once, then on schedule.
    weatherJob(job);
    scheduleJob(job.schedule, () => weatherJob(job));
    break;
  case EJobType.None:
  default:
    console.log(`No job type specified for job ${job}`);
    break;
  }
};
