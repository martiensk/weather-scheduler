import { EJobType } from '../enums/jobs.enums';

/**
 * Represents a scheduled job.
 */
export type IScheduledJob = {
    /**
     * The type of the job.
     */
    type: EJobType;
    /**
     * Details about the job.
     */
    details: string;
    /**
     * The schedule for the job.
     */
    schedule: string;
}