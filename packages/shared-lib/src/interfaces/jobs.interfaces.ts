/**
 * @file Interfaces for scheduled jobs.
 */
import { EJobType } from '../enums/jobs.enums';

/**
 * Represents a scheduled job.
 */
export type IScheduledJob = {
    id: number;
    type: EJobType;
    details: IWeatherJobDetails; // If we add more Job types this will need to be a union type.
    schedule: string;
}

/**
 * Interface for weather job details.
 */
type IWeatherJobDetails = {
    location: string;
}