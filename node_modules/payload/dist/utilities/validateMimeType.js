export const validateMimeType = (mimeType, allowedMimeTypes)=>{
    const cleanedMimeTypes = allowedMimeTypes.map((v)=>v.replace('*', ''));
    return cleanedMimeTypes.some((cleanedMimeType)=>mimeType.startsWith(cleanedMimeType));
};

//# sourceMappingURL=validateMimeType.js.map