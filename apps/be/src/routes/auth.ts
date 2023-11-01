/**
 * @file Auth routes.
 */

import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import querystring from 'querystring';

const router = express.Router();
require('dotenv').config();

// router.get('/login', 
//   passport.authenticate('auth0', { 
//     scope: 'openid email profile'
//   }), 
//   (req: Request, res: Response) => {
//     res.redirect('/');
//   });

// router.get('/callback', 
//   (req: Request, res: Response, next: NextFunction) => {
//     passport.authenticate('auth0', (err: Error, user: any) => {
//       if(err) {
//         return next(err);
//       }
//       if(!user) {
//         return res.redirect('/login');
//       }
//       req.logIn(user, (err) => {
//         if(err) {
//           return next(err);
//         }
//         if(req.session.returnTo) {
//           const returnTo = req.session.returnTo;
//           delete req.session.returnTo;
//           res.redirect(returnTo || '/');
//         }
//       });
//     })(req, res, next);
//   });

// router.get('/logout', (req: Request, res) => {
//   req.logOut();
  
//   let returnTo = req.protocol + '://' + req.hostname;
//   const port = req.connection.localPort;
  
//   if (port !== undefined && port !== 80 && port !== 443) {
//     returnTo = process.env.NODE_ENV === 'production' ? `${returnTo}/` : `${returnTo}:${port}/`;
//   }
  
//   const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);
  
//   const searchString = querystring.stringify({
//     client_id: process.env.AUTH0_CLIENT_ID,
//     returnTo
//   });
//   logoutURL.search = searchString;
  
//   res.redirect(logoutURL.href);
// });

// export default router;