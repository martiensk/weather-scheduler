/**
 * @file Auth controller.
 */
import { getCache } from '../repositories/cacheRepository';
import { Request, Response } from 'express';
import { ECacheKeys } from '../enums/cacheKeys.enum';
import { createAdminUser } from '../services/authService';

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

export const setAdminPassword = (req: Request, res: Response) => {
  try {
    if(!getCache<boolean>(ECacheKeys.ADMIN_ACTIVE)) {
      createAdminUser(req.body.password);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};