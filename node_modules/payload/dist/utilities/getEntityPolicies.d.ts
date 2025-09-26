import type { CollectionPermission, FieldsPermissions, GlobalPermission } from '../auth/types.js';
import type { SanitizedCollectionConfig } from '../collections/config/types.js';
import type { SanitizedGlobalConfig } from '../globals/config/types.js';
import type { BlockSlug } from '../index.js';
import type { AllOperations, PayloadRequest } from '../types/index.js';
export type BlockPolicies = Record<BlockSlug, FieldsPermissions | Promise<FieldsPermissions>>;
type Args = {
    blockPolicies: BlockPolicies;
    entity: SanitizedCollectionConfig | SanitizedGlobalConfig;
    id?: number | string;
    operations: AllOperations[];
    req: PayloadRequest;
    type: 'collection' | 'global';
};
type ReturnType<T extends Args> = T['type'] extends 'global' ? GlobalPermission : CollectionPermission;
/**
 * Build up permissions object for an entity (collection or global)
 */
export declare function getEntityPolicies<T extends Args>(args: T): Promise<ReturnType<T>>;
export {};
//# sourceMappingURL=getEntityPolicies.d.ts.map