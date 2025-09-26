import { status as httpStatus } from 'http-status';
import { APIError } from '../../errors/index.js';
import { Forbidden } from '../../index.js';
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js';
import { commitTransaction } from '../../utilities/commitTransaction.js';
import { initTransaction } from '../../utilities/initTransaction.js';
import { killTransaction } from '../../utilities/killTransaction.js';
import { executeAccess } from '../executeAccess.js';
import { getLoginOptions } from '../getLoginOptions.js';
import { resetLoginAttempts } from '../strategies/local/resetLoginAttempts.js';
export const unlockOperation = async (args)=>{
    const { collection: { config: collectionConfig }, overrideAccess, req: { locale }, req } = args;
    const loginWithUsername = collectionConfig.auth.loginWithUsername;
    const { canLoginWithEmail, canLoginWithUsername } = getLoginOptions(loginWithUsername);
    const sanitizedEmail = canLoginWithEmail && (args.data?.email || '').toLowerCase().trim();
    const sanitizedUsername = canLoginWithUsername && 'username' in args.data && typeof args.data.username === 'string' && args.data.username.toLowerCase().trim() || null;
    if (collectionConfig.auth.disableLocalStrategy) {
        throw new Forbidden(req.t);
    }
    if (!sanitizedEmail && !sanitizedUsername) {
        throw new APIError(`Missing ${collectionConfig.auth.loginWithUsername ? 'username' : 'email'}.`, httpStatus.BAD_REQUEST);
    }
    try {
        const shouldCommit = await initTransaction(req);
        // /////////////////////////////////////
        // Access
        // /////////////////////////////////////
        if (!overrideAccess) {
            await executeAccess({
                req
            }, collectionConfig.access.unlock);
        }
        // /////////////////////////////////////
        // Unlock
        // /////////////////////////////////////
        let whereConstraint = {};
        if (canLoginWithEmail && sanitizedEmail) {
            whereConstraint = {
                email: {
                    equals: sanitizedEmail
                }
            };
        } else if (canLoginWithUsername && sanitizedUsername) {
            whereConstraint = {
                username: {
                    equals: sanitizedUsername
                }
            };
        }
        // Exclude trashed users unless `trash: true`
        whereConstraint = appendNonTrashedFilter({
            enableTrash: Boolean(collectionConfig.trash),
            trash: false,
            where: whereConstraint
        });
        const user = await req.payload.db.findOne({
            collection: collectionConfig.slug,
            locale: locale,
            req,
            where: whereConstraint
        });
        let result = null;
        if (user) {
            await resetLoginAttempts({
                collection: collectionConfig,
                doc: user,
                payload: req.payload,
                req
            });
            result = true;
        } else {
            result = null;
        }
        if (shouldCommit) {
            await commitTransaction(req);
        }
        return result;
    } catch (error) {
        await killTransaction(req);
        throw error;
    }
};

//# sourceMappingURL=unlock.js.map