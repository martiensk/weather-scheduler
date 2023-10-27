import { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';
import { getAllScheduledJobs, saveJob } from '../services/schedulerService';
import { Request, Response, NextFunction } from 'express';
import { getCache } from '../repositories/cacheRepository';
import { ECacheKeys } from '../enums/cacheKeys.enum';

/**
 * Retrieves all scheduled jobs from cache or database and returns them as a JSON response.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 * @returns {Promise<IScheduledJob[]>} A JSON response containing all scheduled jobs.
 */
export const getAllSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Try grab from cache
        let allJobs: IScheduledJob[] = getCache<IScheduledJob[]>(ECacheKeys.SCHEDULED_JOBS);
        console.log(allJobs)
        if(!allJobs) {
            allJobs = await getAllScheduledJobs();
        }
        
        res.json(allJobs);
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ success: false });
    }
}

/**
 * Adds a new scheduled job to the database.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating whether the operation was successful.
 */
export const addNewJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body as IScheduledJob;
        console.log(data);

        await saveJob(data);

        res.json({ success: true });
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ success: false });
    }
}