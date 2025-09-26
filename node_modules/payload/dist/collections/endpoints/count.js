import { status as httpStatus } from 'http-status';
import { getRequestCollection } from '../../utilities/getRequestEntity.js';
import { countOperation } from '../operations/count.js';
export const countHandler = async (req)=>{
    const collection = getRequestCollection(req);
    const { trash, where } = req.query;
    const result = await countOperation({
        collection,
        req,
        trash: trash === 'true',
        where
    });
    return Response.json(result, {
        status: httpStatus.OK
    });
};

//# sourceMappingURL=count.js.map