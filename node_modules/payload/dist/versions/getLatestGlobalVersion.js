export const getLatestGlobalVersion = async ({ slug, config, locale, payload, published, req, where })=>{
    let latestVersion;
    const whereQuery = published ? {
        'version._status': {
            equals: 'published'
        }
    } : {
        latest: {
            equals: true
        }
    };
    if (config.versions?.drafts) {
        latestVersion = (await payload.db.findGlobalVersions({
            global: slug,
            limit: 1,
            locale,
            pagination: false,
            req,
            where: whereQuery
        })).docs[0];
    }
    const global = await payload.db.findGlobal({
        slug,
        locale,
        req,
        where
    });
    const globalExists = Boolean(global);
    if (!latestVersion) {
        return {
            global,
            globalExists
        };
    }
    if (!latestVersion.version.createdAt) {
        latestVersion.version.createdAt = latestVersion.createdAt;
    }
    if (!latestVersion.version.updatedAt) {
        latestVersion.version.updatedAt = latestVersion.updatedAt;
    }
    return {
        global: latestVersion.version,
        globalExists
    };
};

//# sourceMappingURL=getLatestGlobalVersion.js.map