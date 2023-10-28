/**
 * @file Home controller.
 */
import { Request, Response } from 'express';

/**
 * Handles the home route.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export const home = (req: Request, res: Response) => {
  res.end('OK');
};