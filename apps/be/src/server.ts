import express, { CookieOptions } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import expressSession, { SessionOptions } from 'express-session';
// Auth
import passport from 'passport';
import auth0Strategy from 'passport-auth0';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import checkRouter from './routes/check'

require('dotenv').config();

var app = express();

const session = {
    secret: process.env.SESSION_SECRET,
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

//#region Auth0
if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_CLIENT_SECRET || !process.env.AUTH0_CALLBACK_URL) {
    throw new Error('Missing required environment variables for Auth0 configuration');
}

//#region Passport set-up
const strategy = new auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        /**
         * Access tokens are used to authorize users to an API
         * (resource server)
         * accessToken is the token to call the Auth0 API
         * or a secured third-party API
         * extraParams.id_token has the JSON Web Token
         * profile has all the information from the user
         */
        return done(null, profile);
    });

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
});

//#endregion
//#endregion

app.use('/', indexRouter);
app.use('/check', checkRouter);
app.use('/users', usersRouter);

export default app;