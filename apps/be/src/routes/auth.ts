/**
 * @file Auth routes.
 */
import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

router.get('/check-admin', authController.checkAdminUser);
router.post('/set-user', authController.setAdminPassword);

export default router;