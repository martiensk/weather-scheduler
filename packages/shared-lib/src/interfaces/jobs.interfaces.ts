/**
 * @file Interfaces for scheduled jobs.
 */
import { EJobType } from '../enums/jobs.enums';
import { IWeatherCurrent } from './weather.interfaces';

/**
 * Represents a scheduled job.
 * If more Jobs are added this will either become a base type, or some properties will become union types.
 */
export type IScheduledJob = {
    id: number;
    type: EJobType;
    details: IWeatherJobDetails; // If we add more Job types this will need to be a union type.
    schedule: string;
    runs?: IWeatherCurrent[]; // Same here, if we add more Job types this will need to be a union type.
}

/**
 * Interface for weather job details.
 */
type IWeatherJobDetails = {
    location: string;
}