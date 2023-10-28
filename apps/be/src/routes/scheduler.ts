/**
 * @file Scheduler routes.
 */
import express from 'express';
import * as schedulerController from '../controllers/schedulerController';

const router = express.Router();

router.get('/get-all', schedulerController.getAllSchedules);
router.post('/add', schedulerController.addNewJob);

export default router;