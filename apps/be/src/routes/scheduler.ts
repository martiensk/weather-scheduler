/**
 * @file Scheduler routes.
 */
import express from 'express';
import * as schedulerController from '../controllers/schedulerController';

const router = express.Router();

router.get('/get-schedules', schedulerController.getAllSchedules);
router.post('/add', schedulerController.addNewJob);
router.get('/get-jobs', schedulerController.getAllJobs);

export default router;