import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

/**
 * Opens or creates a SQLite database and sets up the necessary tables.
 * @returns Promise<void>
 * @throws Error if the database fails to initialize
 */
export const openOrCreateDb = async (): Promise<void> => {
    // Open or create the database
    db = await open({
        filename: "./db.sqlite",
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
                FOREIGN KEY(TypeId) REFERENCES JobType(Id)
            );
        `);

        // Checking if the DB is empty. If so, populate the schedule tables with some initial data.
        const data = await db.all('SELECT * FROM JobType LIMIT 1');
        if(data.length === 0) {
            await populateDb();
            console.log('Initial schedule data written to DB.');
        }

        return;
    }

    throw new Error("Database not initialised");
};

/**
 * Populates the database with initial data.
 * @throws {Error} If the database is not initialised.
 */
const populateDb = async () => {
    if (!db) {
        throw new Error("Database not initialised");
    }

    await db.run("INSERT INTO JobType (Type, Description) VALUES (?, ?)", [0, "None"]);
    await db.run("INSERT INTO JobType (Type, Description) VALUES (?, ?)", [1, "Weather"]);
};

/**
 * Fetches all jobs from the database.
 * @throws {Error} If the database is not initialised.
 * @returns {Promise<IScheduledJob[]>} A promise that resolves to an array of job schedules.
 */
export const fetchAllJobs = async () => {
    if (!db) {
        throw new Error("Database not initialised");
    }

    const data = await db.all(`
        SELECT * FROM JobSchedule t2
    `);

    return data;
};

/**
 * Inserts a scheduled job into the database.
 * @param {IScheduledJob} job - The scheduled job to be inserted.
 * @throws An error if the database is not initialised.
 */
export const insertJob = async (job: IScheduledJob) => {
    if (!db) {
        throw new Error("Database not initialised");
    }
    console.log('Inserting job');

    await db.run("INSERT INTO JobSchedule (TypeId, Details, Schedule) VALUES (?, ?, ?)", [job.type, job.details, job.schedule]);
}