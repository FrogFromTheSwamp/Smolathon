import type { SanitizedCollectionConfig, TypeWithID } from '../collections/config/types.js';
import type { SanitizedGlobalConfig } from '../globals/config/types.js';
import type { Payload } from '../index.js';
import type { PayloadRequest, SelectType } from '../types/index.js';
type Args = {
    autosave?: boolean;
    collection?: SanitizedCollectionConfig;
    docWithLocales: any;
    draft?: boolean;
    global?: SanitizedGlobalConfig;
    id?: number | string;
    operation?: 'create' | 'restoreVersion' | 'update';
    payload: Payload;
    publishSpecificLocale?: string;
    req?: PayloadRequest;
    select?: SelectType;
    snapshot?: any;
};
export declare const saveVersion: ({ id, autosave, collection, docWithLocales: doc, draft, global, operation, payload, publishSpecificLocale, req, select, snapshot, }: Args) => Promise<TypeWithID>;
export {};
//# sourceMappingURL=saveVersion.d.ts.map