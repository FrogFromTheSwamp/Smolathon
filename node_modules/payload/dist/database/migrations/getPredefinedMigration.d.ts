import type { Payload } from '../../index.js';
import type { MigrationTemplateArgs } from '../types.js';
/**
 * Get predefined migration 'up', 'down' and 'imports'
 */
export declare const getPredefinedMigration: ({ dirname, file, migrationName: migrationNameArg, payload, }: {
    dirname: string;
    file?: string;
    migrationName?: string;
    payload: Payload;
}) => Promise<MigrationTemplateArgs>;
//# sourceMappingURL=getPredefinedMigration.d.ts.map