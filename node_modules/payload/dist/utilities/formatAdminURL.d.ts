import type { Config } from '../config/types.js';
/** Will read the `routes.admin` config and appropriately handle `"/"` admin paths */
export declare const formatAdminURL: (args: {
    adminRoute: NonNullable<Config["routes"]>["admin"];
    basePath?: string;
    path: "" | `/${string}` | null | undefined;
    serverURL?: Config["serverURL"];
}) => string;
//# sourceMappingURL=formatAdminURL.d.ts.map