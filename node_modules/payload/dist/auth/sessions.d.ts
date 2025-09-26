import type { SanitizedCollectionConfig } from '../collections/config/types.js';
import type { TypedUser } from '../index.js';
import type { Payload, PayloadRequest } from '../types/index.js';
import type { UserSession } from './types.js';
/**
 * Removes expired sessions from an array of sessions
 */
export declare const removeExpiredSessions: (sessions: UserSession[]) => UserSession[];
/**
 * Adds a session to the user and removes expired sessions
 * @returns The session ID (sid) if sessions are used
 */
export declare const addSessionToUser: ({ collectionConfig, payload, req, user, }: {
    collectionConfig: SanitizedCollectionConfig;
    payload: Payload;
    req: PayloadRequest;
    user: TypedUser;
}) => Promise<{
    sid?: string;
}>;
//# sourceMappingURL=sessions.d.ts.map