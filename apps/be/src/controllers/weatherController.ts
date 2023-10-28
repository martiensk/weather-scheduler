/**
 * @file This file contains all the functions that are used to handle requests to the weather API.
 */

import { getLocations } from '../services/weatherService';
import { Request, Response, NextFunction } from 'express';

/**
 * Retrieves all locations matching a search string and returns them as a JSON response.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<unknown[]>} A JSON response containing all matched locations.
 */
export const searchLocations = async(req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    
    if (!query) {
      throw new Error('No query provided');
    }
    
    res.json(await getLocations(query));
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ success: false });
  }
};
