/**
 * @file Interfaces for scheduled jobs.
 */

import { EUserRole } from '../enums/userRoles.enums';

/**
 * Represents a user.
 */
export type IUser = {
    username: string;
    password?: string;
    role: EUserRole;
}