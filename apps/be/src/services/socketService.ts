/**
 * @file A very simple WebSocket service.
 */
import { Server } from 'http';
import WebSocket from 'ws';

let wss: WebSocket.Server | null = null;

/**
 * Starts a WebSocket server using the provided HTTP server.
 * @param {Server} httpServer - The HTTP server to use for the WebSocket server.
 */
export const startWSS = (httpServer: Server) => {
  if(!wss) {
    try {
      wss = new WebSocket.Server({ server: httpServer });
      console.log('WebSocket server started.');
    } catch(err) {
      console.error('WebSocket server failed to start.', err);
    }
  }
};

/**
 * Sends a message to all connected WebSocket clients.
 * @param {string} message - The message to send. Should be a stringified JSON object.
 */
export const sendMessage = (message: string) => {
  if(wss) {
    wss.clients.forEach((client) => {
      if(client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
};