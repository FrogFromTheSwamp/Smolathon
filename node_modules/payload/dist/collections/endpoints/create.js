import { getTranslation } from '@payloadcms/translations';
import { status as httpStatus } from 'http-status';
import { getRequestCollection } from '../../utilities/getRequestEntity.js';
import { headersWithCors } from '../../utilities/headersWithCors.js';
import { isNumber } from '../../utilities/isNumber.js';
import { sanitizePopulateParam } from '../../utilities/sanitizePopulateParam.js';
import { sanitizeSelectParam } from '../../utilities/sanitizeSelectParam.js';
import { createOperation } from '../operations/create.js';
export const createHandler = async (req)=>{
    const collection = getRequestCollection(req);
    const { searchParams } = req;
    const autosave = searchParams.get('autosave') === 'true';
    const draft = searchParams.get('draft') === 'true';
    const depth = searchParams.get('depth');
    const publishSpecificLocale = req.query.publishSpecificLocale;
    const doc = await createOperation({
        autosave,
        collection,
        data: req.data,
        depth: isNumber(depth) ? depth : undefined,
        draft,
        populate: sanitizePopulateParam(req.query.populate),
        publishSpecificLocale,
        req,
        select: sanitizeSelectParam(req.query.select)
    });
    return Response.json({
        doc,
        message: req.t('general:successfullyCreated', {
            label: getTranslation(collection.config.labels.singular, req.i18n)
        })
    }, {
        headers: headersWithCors({
            headers: new Headers(),
            req
        }),
        status: httpStatus.CREATED
    });
};

//# sourceMappingURL=create.js.map