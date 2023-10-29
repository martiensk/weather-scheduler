/**
 * @file WebSocket client.
 */

/**
 * Initializes a WebSocket connection to a server and sets up a listener to handle incoming messages.
 */
export const initWSS = (): void => {
  const ws = new WebSocket('ws://localhost:5000');
  const connectionTimer = new Date().getTime();

  /**
   * Creates a listener for incoming messages and emits them to the appropriate event bus subscribers.
   */
  const createListener = (): void => {
    if(ws.readyState === WebSocket.OPEN) {

      ws.onmessage = (wss) => {
        const message = JSON.parse(wss.data);
    
        /**
         * Opted to use a subscriber pattern for these messages for simplicity.
         */
        eventBus.emit(message.type, message.payload);
      };
    } else {
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - connectionTimer;
      
      // Timeout connection to WSS after 10 seconds.  
      if(timeElapsed > 10000) {
        console.error('WSS CONNECTION FAILED');
        ws.close();
        return;
      }
      
      window.requestAnimationFrame(createListener);
    }
  };

  createListener();
};