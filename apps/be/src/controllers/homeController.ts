import { Request, Response, NextFunction } from 'express';

/**
 * Handles the home route.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 */
export const home = (req: Request, res: Response, next: NextFunction) => {
    res.end('OK')
}