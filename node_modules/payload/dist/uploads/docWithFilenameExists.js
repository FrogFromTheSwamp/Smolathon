export const docWithFilenameExists = async ({ collectionSlug, filename, req })=>{
    const doc = await req.payload.db.findOne({
        collection: collectionSlug,
        req,
        where: {
            filename: {
                equals: filename
            }
        }
    });
    if (doc) {
        return true;
    }
    return false;
};

//# sourceMappingURL=docWithFilenameExists.js.map