/**
 * @file Weather API routes.
 */
import express from 'express';
import * as weatherController from '../controllers/weatherController';

const router = express.Router();

router.get('/search', weatherController.searchLocations);

export default router;