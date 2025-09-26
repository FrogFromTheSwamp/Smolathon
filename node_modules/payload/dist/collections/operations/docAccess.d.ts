import type { SanitizedCollectionPermission } from '../../auth/index.js';
import type { PayloadRequest } from '../../types/index.js';
import type { Collection } from '../config/types.js';
type Arguments = {
    collection: Collection;
    id: number | string;
    req: PayloadRequest;
};
export declare function docAccessOperation(args: Arguments): Promise<SanitizedCollectionPermission>;
export {};
//# sourceMappingURL=docAccess.d.ts.map