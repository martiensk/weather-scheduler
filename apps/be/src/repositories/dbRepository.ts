/**
 * @file This file contains the database repository.
 */
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import type { IScheduledJob, IUser } from 'shared-lib';
import { EUserRole } from 'shared-lib';
import { getCache, setCache } from './cacheRepository';
import { ECacheKeys } from '../enums/cacheKeys.enum';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

/**
 * Opens or creates a SQLite database and sets up the necessary tables.
 * @throws Error if the database fails to initialize.
 */
export const openOrCreateDb = async(): Promise<void> => {
  // Open or create the database
  db = await open({
    filename: './db.sqlite',
    driver: sqlite3.Database,
  });

  if(db) {

    /**
     * Close the database connection on SIGTERM.
     * This allows the app to be gracefully shutdown.
     * We keep a single connection open to the DB and recycle it for each request.
     * This is a good compromise between performance and memory usage.
     */
    process.on('SIGTERM', () => {
      db?.close();
    });

    // Create for job types
    await db.run(`
            CREATE TABLE IF NOT EXISTS JobType (
                Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                Type INTEGER NOT NULL,
                Description TEXT NOT NULL
            );
        `);

    // Create table for job schedules
    await db.run(`
            CREATE TABLE IF NOT EXISTS JobSchedule (
                Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                TypeId INTEGER NOT NULL,
                Schedule TEXT NOT NULL,
                Details TEXT NOT NULL,
                Active INTEGER NOT NULL DEFAULT 1,
                FOREIGN KEY(TypeId) REFERENCES JobType(Id)
            );
        `);

    await db.run(`CREATE TABLE IF NOT EXISTS Users (            
            Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            Username TEXT NOT NULL,
            Password TEXT NOT NULL,
            Role INTEGER NOT NULL
        );`);
        
    // Checking if the DB is empty. If so, populate the schedule tables with some initial data.
    const data = await db.all('SELECT * FROM JobType LIMIT 1');
    if(data.length === 0) {
      await populateDb();
      console.log('Initial schedule data written to DB.');
    }
    const users = await db.all('SELECT * FROM Users LIMIT 1');
    setCache<boolean>(ECacheKeys.ADMIN_ACTIVE, users.length > 0);
    console.log('Users found in DB', users.length, getCache<boolean>(ECacheKeys.ADMIN_ACTIVE));

    return;
  }

  throw new Error('Database not initialised');
};

/**
 * Populates the database with initial data.
 * @throws {Error} If the database is not initialised.
 */
const populateDb = async() => {
  if (!db) {
    throw new Error('Database not initialised');
  }

  await db.run('INSERT INTO JobType (Type, Description) VALUES (?, ?)', [0, 'None']);
  await db.run('INSERT INTO JobType (Type, Description) VALUES (?, ?)', [1, 'Weather']);

  // Add one default job to get the Dublin weather every 5 minutes.
  await db.run('INSERT INTO JobSchedule (TypeId, Details, Schedule) VALUES (?, ?, ?)', [1, JSON.stringify({ location: 'dublin-dublin-ireland' }), '*/5 * * * *']);
};

/**
 * Fetches all jobs from the database.
 * @returns {Promise<IScheduledJob[]>} A promise that resolves to an array of job schedules.
 * @throws {Error} If the database is not initialised.
 */
export const fetchAllJobs = async() => {
  if (!db) {
    throw new Error('Database not initialised');
  }

  const data = await db.all<IScheduledJob[]>('SELECT t2.Id as id, t2.TypeId as type, t2.Details as details, t2.Schedule as schedule FROM JobSchedule t2 where t2.Active = 1');
  data.map((job) => {
    job.details = JSON.parse(job.details as unknown as string);
    return job;
  });
  return data;
};

/**
 * Inserts a scheduled job into the database.
 * @param {IScheduledJob} job - The scheduled job to be inserted.
 * @returns {Promise<number>} A promise that resolves to the id of the inserted job.
 * @throws An error if the database is not initialised.
 */
export const insertJob = async(job: IScheduledJob) => {
  if (!db) {
    throw new Error('Database not initialised');
  }
  console.log('Inserting job');

  /**
   * Technically we could use a job settings table here instead of storing job details as a string. It could be an intersection table between JobSchedule and JobSettingType.
   * Or we could use a generic table with a key/value pair. The key would be the setting type and the value would be the setting value.
   * In a real-world application I would probably do this, but for the purposes of this demo I'm just going to store the details as a string.
   * Also worth noting that this is a parameterised query, so no need to worry about SQL injection.
   */
  const { lastID: table1Id } = await db.run('INSERT INTO JobSchedule (TypeId, Details, Schedule) VALUES (?, ?, ?)', [job.type, JSON.stringify(job.details), job.schedule]);
  if(!table1Id) {
    throw new Error('Failed to insert job');
  }
  return table1Id;
};

/**
 * Deletes a scheduled job from the database.
 * @param {number} jobId - The id of the job to be deleted.
 * @returns {Promise<void>}
 * @throws An error if the database is not initialised.
 */
export const deleteJob = async(jobId: number) => {
  if (!db) {
    throw new Error('Database not initialised');
  }
  console.log('Deleting job');

  await db.run('UPDATE JobSchedule SET Active = 0 WHERE Id = ?', [jobId]);
};

/**
 * Inserts a new user into the database.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @param {EUserRole} role - The role of the user.
 * @returns {number} The ID of the newly inserted user.
 * @throws An error if the database is not initialised or if the user insertion fails.
 */
export const insertUser = async(username: string, password: string, role: EUserRole) => {
  if (!db) {
    throw new Error('Database not initialised');
  }
  console.log('Inserting user');

  const { lastID: table1Id } = await db.run('INSERT INTO Users (Username, Password, Role) VALUES (?, ?, ?)', [username, password, role]);
  if(!table1Id) {
    throw new Error('Failed to insert user');
  }
  return table1Id;
};

/**
 * Retrieves a user from the database by their username.
 * @param {string} username - The username of the user to retrieve.
 * @returns {IUser} The user object if found, otherwise null.
 * @throws Error if the database is not initialised.
 */
export const getUser = async(username: string) => {
  if (!db) {
    throw new Error('Database not initialised');
  }

  const data = await db.all<{ Username: string, Password: string, Role: EUserRole}[]>('SELECT Username, Password, Role FROM Users where Username = ? LIMIT 1', [username]);
  
  if(!data || !data.length) {
    return null;
  }
  return {
    username: data[0].Username,
    password: data[0].Password,
    role: data[0].Role
  } as IUser;
};