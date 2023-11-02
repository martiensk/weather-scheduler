/**
 * @file Auth controller.
 */
import { getCache } from '../repositories/cacheRepository';
import { Request, Response, NextFunction } from 'express';
import { ECacheKeys } from '../enums/cacheKeys.enum';
import { authenticateUser, createAdminUser } from '../services/authService';
import jwt from 'jsonwebtoken';
import config from '../config.json';

/**
 * Function to make sure app has an admin.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export const checkAdminUser = (req: Request, res: Response) => {
  console.log('Checking admin user', getCache<boolean>(ECacheKeys.ADMIN_ACTIVE));
  if(!getCache<boolean>(ECacheKeys.ADMIN_ACTIVE)) {
    res.json({ requireAdmin: true });
    return;
  }
  res.json({ requireAdmin: false });
};

/**
 * Sets the admin password if the admin user is not already active.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} A JSON object indicating success or failure.
 */
export const setAdminPassword = async(req: Request, res: Response) => {
  try {
    if(!getCache<boolean>(ECacheKeys.ADMIN_ACTIVE)) {
      await createAdminUser(req.body.password);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/**
 * Authenticates a user and sets the user session if authentication is successful.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} A JSON response indicating whether authentication was successful.
 */
export const login = async(req: Request, res: Response) => {
  try {
    const authResult = await authenticateUser('admin', req.body.password);
    if(authResult.match && authResult.user) {
      const userPayload = authResult.user;
      const token = jwt.sign({ userId: userPayload }, config.session_secret, { expiresIn: '1h' });
      res.json({ success: true, token });
      return;
    }
    res.json({ success: false });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/**
 * Middleware function to check if user is authenticated.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - Express NextFunction object.
 * @returns {void}
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) { return res.sendStatus(401); }

  jwt.verify(token, config.session_secret, (err, user) => {
    if (err) { return res.sendStatus(403); }

    req.user = user;
    next();
  });
};