import type { SanitizedCollectionConfig } from '../../../collections/config/types.js';
import type { PayloadRequest } from '../../../types/index.js';
import { type Payload, type TypedUser } from '../../../index.js';
type Args = {
    collection: SanitizedCollectionConfig;
    payload: Payload;
    req: PayloadRequest;
    user: TypedUser;
};
export declare const incrementLoginAttempts: ({ collection, payload, req, user, }: Args) => Promise<void>;
export {};
//# sourceMappingURL=incrementLoginAttempts.d.ts.map