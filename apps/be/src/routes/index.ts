import { getMsg } from 'shared-lib/src/helpers';
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.end(getMsg())
});

export default router;