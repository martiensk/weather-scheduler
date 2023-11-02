/**
 * @file Auth routes.
 */
import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

// GET requests
router.get('/check-admin', authController.checkAdminUser);
// POST requests
router.post('/set-user', authController.setAdminPassword);
router.post('/login', authController.login);

export default router;