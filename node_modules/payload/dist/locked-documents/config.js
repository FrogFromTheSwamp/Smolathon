import { defaultAccess } from '../auth/defaultAccess.js';
export const lockedDocumentsCollectionSlug = 'payload-locked-documents';
export const getLockedDocumentsCollection = (config)=>({
        slug: lockedDocumentsCollectionSlug,
        access: {
            create: defaultAccess,
            delete: defaultAccess,
            read: defaultAccess,
            update: defaultAccess
        },
        admin: {
            hidden: true
        },
        fields: [
            {
                name: 'document',
                type: 'relationship',
                index: true,
                maxDepth: 0,
                relationTo: [
                    ...config.collections.map((collectionConfig)=>collectionConfig.slug)
                ]
            },
            {
                name: 'globalSlug',
                type: 'text',
                index: true
            },
            {
                name: 'user',
                type: 'relationship',
                maxDepth: 1,
                relationTo: config.collections.filter((collectionConfig)=>collectionConfig.auth).map((collectionConfig)=>collectionConfig.slug),
                required: true
            }
        ],
        lockDocuments: false
    });

//# sourceMappingURL=config.js.map