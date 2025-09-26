import type { ParsedArgs } from 'minimist';
import type { SanitizedConfig } from '../config/types.js';
export declare const availableCommands: string[];
type Args = {
    config: SanitizedConfig;
    parsedArgs: ParsedArgs;
};
export declare const migrate: ({ config, parsedArgs }: Args) => Promise<void>;
export {};
//# sourceMappingURL=migrate.d.ts.map