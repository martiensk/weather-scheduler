#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../server';
import debug from 'debug';
import http from 'http';

/**
 * Normalize a port into a number, string, or false.
 * @param {string} val - The port to normalize.
 * @returns {number | string | boolean} The normalized port.
 */
const normalizePort = (val: string): number | string | boolean => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Event listener for HTTP server "error" event.
 * @param {object} error - The error.
 * @throws An error if the error is not handled.
 */
const onError = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'    ? 'Pipe ' + port    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  // Disable no-fallthrough rule of eslint as it doesn't recognise process.exit
  switch (error.code) {
  case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
  case 'EADDRINUSE': // eslint-disable-line no-fallthrough
    console.error(bind + ' is already in use');
    process.exit(1);
  default: // eslint-disable-line no-fallthrough
    throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  const addr = server.address();
  let bind: string = '';
  if(addr) {
    bind = typeof addr === 'string'    ? `pipe ${addr}`    : `port ${addr.port}`;
  }
  debug(`Listening on ${bind}`);
};

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
console.log(`Listening on port ${port}`);
server.on('error', onError);
server.on('listening', onListening);

