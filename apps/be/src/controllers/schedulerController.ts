/**
 * @file Controller for the scheduler routes.
 */
import { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';
import { getAllScheduledJobs, saveJob } from '../services/schedulerService';
import { Request, Response, NextFunction } from 'express';

/**
 * Retrieves all scheduled jobs from cache or database and returns them as a JSON response.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<IScheduledJob[]>} A JSON response containing all scheduled jobs.
 */
export const getAllSchedules = async(req: Request, res: Response) => {
  try {   
    res.json(await getAllScheduledJobs());
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ success: false });
  }
};

/**
 * Adds a new scheduled job to the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {string} A JSON response indicating whether the operation was successful.
 */
export const addNewJob = async(req: Request, res: Response) => {
  try {
    const data = req.body as IScheduledJob;
    console.log(data);

    await saveJob(data);

    res.json({ success: true });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ success: false });
  }
};