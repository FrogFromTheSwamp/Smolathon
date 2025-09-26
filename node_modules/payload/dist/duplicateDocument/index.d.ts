import type { SanitizedCollectionConfig } from '../collections/config/types.js';
import type { JsonObject, PayloadRequest } from '../types/index.js';
type GetDuplicateDocumentArgs = {
    collectionConfig: SanitizedCollectionConfig;
    draftArg?: boolean;
    id: number | string;
    overrideAccess?: boolean;
    req: PayloadRequest;
    shouldSaveDraft?: boolean;
};
export declare const getDuplicateDocumentData: ({ id, collectionConfig, draftArg, overrideAccess, req, shouldSaveDraft, }: GetDuplicateDocumentArgs) => Promise<{
    duplicatedFromDoc: JsonObject;
    duplicatedFromDocWithLocales: JsonObject;
}>;
export {};
//# sourceMappingURL=index.d.ts.map