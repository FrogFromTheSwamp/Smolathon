import { status as httpStatus } from 'http-status';
import { getRequestCollectionWithID } from '../../utilities/getRequestEntity.js';
import { headersWithCors } from '../../utilities/headersWithCors.js';
import { isNumber } from '../../utilities/isNumber.js';
import { sanitizePopulateParam } from '../../utilities/sanitizePopulateParam.js';
import { restoreVersionOperation } from '../operations/restoreVersion.js';
export const restoreVersionHandler = async (req)=>{
    const { id, collection } = getRequestCollectionWithID(req);
    const { searchParams } = req;
    const depth = searchParams.get('depth');
    const draft = searchParams.get('draft');
    const result = await restoreVersionOperation({
        id,
        collection,
        depth: isNumber(depth) ? Number(depth) : undefined,
        draft: draft === 'true' ? true : undefined,
        populate: sanitizePopulateParam(req.query.populate),
        req
    });
    return Response.json({
        ...result,
        message: req.t('version:restoredSuccessfully')
    }, {
        headers: headersWithCors({
            headers: new Headers(),
            req
        }),
        status: httpStatus.OK
    });
};

//# sourceMappingURL=restoreVersion.js.map