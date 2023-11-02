/**
 * @file This file contains the authentication service.
 */
import bcrypt from 'bcrypt';
import { insertUser, getUser } from '..//repositories/dbRepository';
import { EUserRole } from 'shared-lib';
import config from '../config.json';
import { setCache } from '../repositories/cacheRepository';
import { ECacheKeys } from '../enums/cacheKeys.enum';

/**
 * Creates an admin user with the given password.
 * @param {string} password - The password for the admin user.
 */
export const createAdminUser = async(password: string) => {
  const hash = await bcrypt.hash(password, config.salt_rounds);
  console.log(password, hash);
  await insertUser('admin', hash, EUserRole.ADMINISTRATOR);
  setCache<boolean>(ECacheKeys.ADMIN_ACTIVE, true);
};

/**
 * Authenticates a user with a given username and password.
 * @param {string} username - The username of the user to authenticate.
 * @param {string} password - The password of the user to authenticate.
 * @returns {Promise<object>} - A promise that resolves to an object containing a boolean indicating whether the authentication was successful and the user object if it was successful, or null if it was not.
 */
export const authenticateUser = async(username: string, password: string) => {
  const dbUser = await getUser(username);
  
  if(dbUser?.password) {
    const match = await bcrypt.compare(password, dbUser.password);
    if(!match) {
      return {
        match: false,
        user: null
      };
    }
    return {
      match: true,
      user: dbUser
    };
  }
  return {
    match: false,
    user: null
  };
};