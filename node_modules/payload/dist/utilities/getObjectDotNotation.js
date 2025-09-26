export const getObjectDotNotation = (obj, path, defaultValue)=>{
    if (!path || !obj) {
        return defaultValue;
    }
    const result = path.split('.').reduce((o, i)=>o?.[i], obj);
    return result === undefined ? defaultValue : result;
};

//# sourceMappingURL=getObjectDotNotation.js.map