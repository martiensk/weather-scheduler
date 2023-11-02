import bcrypt from 'bcrypt';
import { insertUser, getUser } from '..//repositories/dbRepository';
import { EUserRole } from 'shared-lib';
import config from '../config.json';
import { setCache } from '../repositories/cacheRepository';
import { ECacheKeys } from '../enums/cacheKeys.enum';

export const createAdminUser = async(password: string) => {
  const hash = await bcrypt.hash(password, config.salt_rounds);
  console.log(password, hash);
  await insertUser('admin', hash, EUserRole.ADMINISTRATOR);
  setCache<boolean>(ECacheKeys.ADMIN_ACTIVE, true);
  console.log('Admin user created.');
};

export const authenticateUser = async(username: string, password: string): Promise<boolean> => {
  const dbUser = await getUser(username);
  if(dbUser?.password) {
    return await bcrypt.compare(password, dbUser.password);
  }
  return false;
};