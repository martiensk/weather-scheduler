/**
 * @file This is the main entrypoint to the application.
 */
import express, { CookieOptions } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import expressSession, { SessionOptions } from 'express-session';
import cors from 'cors';
import config from './config.json';

//#region Services
import { init } from './services/startupService';
//#endregion

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import checkRouter from './routes/scheduler';
import weatherRouter from './routes/weather';
import authRouter from './routes/auth';

const app = express();
app.use(cors());

const session = {
  secret: config.session_secret,
  cookie: {} as CookieOptions,
  resave: false,
  saveUninitialized: false
} as SessionOptions;

if(app.get('env') === 'production' && session.cookie) {
  session.cookie.secure = true;
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession(session));

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
app.use('/users', usersRouter);
app.use('/weather', weatherRouter);
app.use('/auth', authRouter);

export default app;