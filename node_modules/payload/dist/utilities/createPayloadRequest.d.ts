import type { SanitizedConfig } from '../config/types.js';
import type { PayloadRequest } from '../types/index.js';
type Args = {
    canSetHeaders?: boolean;
    config: Promise<SanitizedConfig> | SanitizedConfig;
    params?: {
        collection: string;
    };
    request: Request;
};
export declare const createPayloadRequest: ({ canSetHeaders, config: configPromise, params, request, }: Args) => Promise<PayloadRequest>;
export {};
//# sourceMappingURL=createPayloadRequest.d.ts.map