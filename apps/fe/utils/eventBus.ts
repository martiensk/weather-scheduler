/**
 * @file A global event bus singleton to be used in util modules and provided in Vue.
 */

/**
 * Provides global event registration similar to what the EventBus did in Vue 2.
 */

const createEventBus = () => {
  /**
   * A container to hold registered events.
   * @type {object}
   */
  const events: Record<string, ((data: any) => void)[]> = {};
  
  return {
    /**
     * Registers an event listener with the service.
     * @param {string} eventName - The event name.
     * @param {object} fn - A function to call when the event is fired.
     */
    listen<T>(eventName: string, fn: (data: T) => void) {
      events[eventName] = events[eventName] || [];
      events[eventName].push(fn);
    },
  
    /**
     * Re-registers an event listener with the service.
     * @param {string} eventName - The event name.
     * @param {object} fn - A function to call when the event is fired.
     */
    off<T>(eventName: string, fn: (data: T) => void) {
      if (events[eventName]) {
        for (let i = 0; i < events[eventName].length; i++) {
          if (events[eventName][i] === fn) {
            events[eventName].splice(i, 1);
            break;
          }
        }
      }
    },
  
    /**
     * Fires an event, i.e. Calls the callback function for each registered event.
     * @param {string} eventName - The event name.
     * @param {object} data - Function parameters to pass to the callback.
     */
    emit(eventName: string, data: unknown) {
      if (events[eventName]) {
        events[eventName].forEach((fn) => {
          fn(data);
        });
      }
    }
  };
};
  
export const eventBus = createEventBus();
  