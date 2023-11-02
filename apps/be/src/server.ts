/**
 * @file This is the main entrypoint to the application.
 */
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

//#region Services
import { init } from './services/startupService';
//#endregion

import indexRouter from './routes/index';
import checkRouter from './routes/scheduler';
import weatherRouter from './routes/weather';
import authRouter from './routes/auth';

const app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//#region Initialise DB
init().then(() => {
  console.log('Database initialised');
}).catch((err) => {
  console.error('Error opening database: ' + err.message);
  process.exit(1);
});
//#endregion

app.use('/', indexRouter);
app.use('/scheduler', checkRouter);
app.use('/weather', weatherRouter);
app.use('/auth', authRouter);

export default app;