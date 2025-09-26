import { Forbidden } from '../errors/index.js';
export const executeAccess = async ({ id, data, disableErrors, isReadingStaticFile = false, req }, access)=>{
    if (access) {
        const result = await access({
            id,
            data,
            isReadingStaticFile,
            req
        });
        if (!result) {
            if (!disableErrors) {
                throw new Forbidden(req.t);
            }
        }
        return result;
    }
    if (req.user) {
        return true;
    }
    if (!disableErrors) {
        throw new Forbidden(req.t);
    }
    return false;
};

//# sourceMappingURL=executeAccess.js.map