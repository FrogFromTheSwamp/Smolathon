import { status as httpStatus } from 'http-status';
import { getRequestCollection } from '../../utilities/getRequestEntity.js';
import { headersWithCors } from '../../utilities/headersWithCors.js';
import { isNumber } from '../../utilities/isNumber.js';
import { sanitizeJoinParams } from '../../utilities/sanitizeJoinParams.js';
import { sanitizePopulateParam } from '../../utilities/sanitizePopulateParam.js';
import { sanitizeSelectParam } from '../../utilities/sanitizeSelectParam.js';
import { findOperation } from '../operations/find.js';
export const findHandler = async (req)=>{
    const collection = getRequestCollection(req);
    const { depth, draft, joins, limit, page, pagination, populate, select, sort, trash, where } = req.query;
    const result = await findOperation({
        collection,
        depth: isNumber(depth) ? Number(depth) : undefined,
        draft: draft === 'true',
        joins: sanitizeJoinParams(joins),
        limit: isNumber(limit) ? Number(limit) : undefined,
        page: isNumber(page) ? Number(page) : undefined,
        pagination: pagination === 'false' ? false : undefined,
        populate: sanitizePopulateParam(populate),
        req,
        select: sanitizeSelectParam(select),
        sort: typeof sort === 'string' ? sort.split(',') : undefined,
        trash: trash === 'true',
        where
    });
    return Response.json(result, {
        headers: headersWithCors({
            headers: new Headers(),
            req
        }),
        status: httpStatus.OK
    });
};

//# sourceMappingURL=find.js.map