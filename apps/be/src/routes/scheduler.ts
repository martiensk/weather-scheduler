/**
 * @file Scheduler routes.
 */
import express from 'express';
import * as schedulerController from '../controllers/schedulerController';

const router = express.Router();

// GET requests
router.get('/get-schedules', schedulerController.getAllSchedules);
router.get('/get-jobs', schedulerController.getAllJobs);
// POST requests
router.post('/add', schedulerController.addNewJob);
router.post('/delete-job', schedulerController.deleteJob);

export default router;