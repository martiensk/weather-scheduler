/**
 * @file Scheduler routes.
 */
import express from 'express';
import * as schedulerController from '../controllers/schedulerController';
import { requireAuth } from '../controllers/authController';

const router = express.Router();

// GET requests
router.get('/get-schedules', schedulerController.getAllSchedules);
router.get('/get-jobs', schedulerController.getAllJobs);
// POST requests
router.post('/add', requireAuth, schedulerController.addNewJob);
router.post('/delete-job', requireAuth, schedulerController.deleteJob);

export default router;