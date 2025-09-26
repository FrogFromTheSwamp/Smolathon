// @ts-strict-ignore
import { deepCopyObjectSimple } from '../index.js';
import { sanitizeInternalFields } from '../utilities/sanitizeInternalFields.js';
import { getQueryDraftsSelect } from './drafts/getQueryDraftsSelect.js';
import { enforceMaxVersions } from './enforceMaxVersions.js';
export const saveVersion = async ({ id, autosave, collection, docWithLocales: doc, draft, global, operation, payload, publishSpecificLocale, req, select, snapshot })=>{
    let result;
    let createNewVersion = true;
    const now = new Date().toISOString();
    const versionData = deepCopyObjectSimple(doc);
    if (draft) {
        versionData._status = 'draft';
    }
    if (collection?.timestamps && draft) {
        versionData.updatedAt = now;
    }
    if (versionData._id) {
        delete versionData._id;
    }
    try {
        if (autosave) {
            let docs;
            const findVersionArgs = {
                limit: 1,
                pagination: false,
                req,
                sort: '-updatedAt'
            };
            if (collection) {
                ;
                ({ docs } = await payload.db.findVersions({
                    ...findVersionArgs,
                    collection: collection.slug,
                    limit: 1,
                    pagination: false,
                    req,
                    where: {
                        parent: {
                            equals: id
                        }
                    }
                }));
            } else {
                ;
                ({ docs } = await payload.db.findGlobalVersions({
                    ...findVersionArgs,
                    global: global.slug,
                    limit: 1,
                    pagination: false,
                    req
                }));
            }
            const [latestVersion] = docs;
            // overwrite the latest version if it's set to autosave
            if (latestVersion && 'autosave' in latestVersion && latestVersion.autosave === true) {
                createNewVersion = false;
                const data = {
                    createdAt: new Date(latestVersion.createdAt).toISOString(),
                    latest: true,
                    parent: id,
                    updatedAt: now,
                    version: {
                        ...versionData
                    }
                };
                const updateVersionArgs = {
                    id: latestVersion.id,
                    req,
                    versionData: data
                };
                if (collection) {
                    result = await payload.db.updateVersion({
                        ...updateVersionArgs,
                        collection: collection.slug,
                        req
                    });
                } else {
                    result = await payload.db.updateGlobalVersion({
                        ...updateVersionArgs,
                        global: global.slug,
                        req
                    });
                }
            }
        }
        if (createNewVersion) {
            const createVersionArgs = {
                autosave: Boolean(autosave),
                collectionSlug: undefined,
                createdAt: operation === 'restoreVersion' ? versionData.createdAt : now,
                globalSlug: undefined,
                parent: collection ? id : undefined,
                publishedLocale: publishSpecificLocale || undefined,
                req,
                select: getQueryDraftsSelect({
                    select
                }),
                updatedAt: now,
                versionData
            };
            if (collection) {
                createVersionArgs.collectionSlug = collection.slug;
                result = await payload.db.createVersion(createVersionArgs);
            }
            if (global) {
                createVersionArgs.globalSlug = global.slug;
                result = await payload.db.createGlobalVersion(createVersionArgs);
            }
            if (publishSpecificLocale && snapshot) {
                const snapshotData = deepCopyObjectSimple(snapshot);
                if (snapshotData._id) {
                    delete snapshotData._id;
                }
                snapshotData._status = 'draft';
                const snapshotDate = new Date().toISOString();
                const updatedArgs = {
                    ...createVersionArgs,
                    createdAt: snapshotDate,
                    returning: false,
                    snapshot: true,
                    updatedAt: snapshotDate,
                    versionData: snapshotData
                };
                if (collection) {
                    await payload.db.createVersion(updatedArgs);
                }
                if (global) {
                    await payload.db.createGlobalVersion(updatedArgs);
                }
            }
        }
    } catch (err) {
        let errorMessage;
        if (collection) {
            errorMessage = `There was an error while saving a version for the ${typeof collection.labels.singular === 'string' ? collection.labels.singular : collection.slug} with ID ${id}.`;
        }
        if (global) {
            errorMessage = `There was an error while saving a version for the global ${typeof global.label === 'string' ? global.label : global.slug}.`;
        }
        payload.logger.error({
            err,
            msg: errorMessage
        });
        return undefined;
    }
    const max = collection ? collection.versions.maxPerDoc : global.versions.max;
    if (createNewVersion && max > 0) {
        await enforceMaxVersions({
            id,
            collection,
            global,
            max,
            payload,
            req
        });
    }
    let createdVersion = result.version;
    createdVersion = sanitizeInternalFields(createdVersion);
    createdVersion.id = result.parent;
    return createdVersion;
};

//# sourceMappingURL=saveVersion.js.map