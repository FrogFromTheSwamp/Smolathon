import type { FlattenedField } from '../fields/config/types.js';
/**
 * Get the field from by its path.
 * Can accept nested paths, e.g: group.title, array.group.title
 * If there were any localized on the path, pathHasLocalized will be true and localizedPath will look like:
 * group.<locale>.title // group is localized here
 */
export declare const getFieldByPath: ({ fields, localizedPath, path, }: {
    fields: FlattenedField[];
    localizedPath?: string;
    path: string;
}) => {
    field: FlattenedField;
    localizedPath: string;
    pathHasLocalized: boolean;
} | null;
//# sourceMappingURL=getFieldByPath.d.ts.map