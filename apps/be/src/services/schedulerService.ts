import { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';
import { fetchAllJobs, insertJob } from '../repositories/dbRepository';
import { setCache } from '../repositories/cacheRepository';
import { ECacheKeys } from '../enums/cacheKeys.enum';

/**
 * Retrieves all scheduled jobs.
 * @returns {IScheduledJob[]} A promise that resolves to an array of scheduled jobs.
 */
export const getAllScheduledJobs = async () => {
    return await fetchAllJobs();
}

/**
 * Saves a scheduled job to the database and updates the cache with all scheduled jobs.
 * @param {IScheduledJob} job The scheduled job to be saved.
 * @returns {Promise<IScheduledJob[]>} A Promise that resolves when the job has been saved and the cache has been updated.
 */
export const saveJob = async (job: IScheduledJob) => {
    await insertJob(job);
    const allJobs = await fetchAllJobs();
    setCache<IScheduledJob[]>(ECacheKeys.SCHEDULED_JOBS, allJobs);
}