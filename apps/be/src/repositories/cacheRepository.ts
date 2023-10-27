import NodeCache from 'node-cache';

/* 
 * Cache is infinite. As we only need to cache one list of tasks this should be manageable.
 * In a real-world scenario we would have separate caches for different types of data.
 * I would probably write some sort of self-managing cache.
 */
let cache: NodeCache | null = null;

/**
 * Initializes the cache with an infinite time-to-live and no check period.
 */
export const initCache = () => {
    cache = new NodeCache({ stdTTL: 0, checkperiod: 0 });
}

/**
 * Sets a value in the cache with the given key.
 * @param {string} key - The key to set the value under.
 * @param {T} value - The value to set in the cache.
 */
export const setCache = <T>(key: string, value: T) => {
    cache?.set(key, value);
}

/**
 * Retrieves the value associated with the specified key from the cache.
 * @param {string} key - The key of the value to retrieve.
 * @returns {T} The value associated with the specified key, or undefined if the key is not found in the cache.
 */
export const getCache = <T>(key: string) => {
    return cache?.get(key) as T;
}