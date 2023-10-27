import { initCache } from '../repositories/cacheRepository';
import { openOrCreateDb } from '../repositories/dbRepository';

/**
 * Initializes the application by initializing the cache and opening or creating the database.
 */
export const init = async () => {
    // Cache
    await initCache();
    // DB
    await openOrCreateDb();
}