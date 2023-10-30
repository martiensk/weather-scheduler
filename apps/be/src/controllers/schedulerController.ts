/**
 * @file Controller for the scheduler routes.
 */
import { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';
import { getAllScheduledJobs, saveJob, deleteAJob } from '../services/schedulerService';
import { getAllJobDetails } from './../services/jobsService';
import { Request, Response } from 'express';

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
    await saveJob(data);
    res.json({ success: true });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ success: false });
  }
};

// Not sure why this is needed, but looks like the plugin does not recognise res.json([]) as a function return.
// eslint-disable-next-line jsdoc/require-returns-check
/**
 * Retrieves details of all jobs.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {string} An array of all job details.
 */
export const getAllJobs = async(req: Request, res: Response) => {
  try {
    console.log('Getting all jobs');
    const jobs = await getAllJobDetails();
    res.json(jobs);
  } catch (ex) {
    console.log(ex);
    res.status(500).json([]);
  }
};

/**
 * Deletes a job with the given ID from the scheduler.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {object} A JSON object indicating whether the operation was successful.
 */
export const deleteJob = async(req: Request, res: Response) => {
  try {
    const jobId = req.body.id;
    await deleteAJob(jobId);
    res.json({ success: true });
  } catch(ex) {
    console.log(ex);
    res.status(500).json({ success: false });
  }
};