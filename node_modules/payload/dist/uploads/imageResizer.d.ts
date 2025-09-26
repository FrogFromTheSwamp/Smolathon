import type { SanitizedCollectionConfig } from '../collections/config/types.js';
import type { SharpDependency } from '../config/types.js';
import type { PayloadRequest } from '../types/index.js';
import type { WithMetadata } from './optionallyAppendMetadata.js';
import type { FileSizes, FileToSave, ProbedImageSize, UploadEdits } from './types.js';
type ResizeArgs = {
    config: SanitizedCollectionConfig;
    dimensions: ProbedImageSize;
    file: PayloadRequest['file'];
    mimeType: string;
    req: PayloadRequest;
    savedFilename: string;
    sharp?: SharpDependency;
    staticPath: string;
    uploadEdits?: UploadEdits;
    withMetadata?: WithMetadata;
};
/** Result from resizing and transforming the requested image sizes */
type ImageSizesResult = {
    focalPoint?: UploadEdits['focalPoint'];
    sizeData: FileSizes;
    sizesToSave: FileToSave[];
};
/**
 * For the provided image sizes, handle the resizing and the transforms
 * (format, trim, etc.) of each requested image size and return the result object.
 * This only handles the image sizes. The transforms of the original image
 * are handled in {@link ./generateFileData.ts}.
 *
 * The image will be resized according to the provided
 * resize config. If no image sizes are requested, the resolved data will be empty.
 * For every image that does not need to be resized, a result object with `null`
 * parameters will be returned.
 *
 * @param resizeConfig - the resize config
 * @returns the result of the resize operation(s)
 */
export declare function resizeAndTransformImageSizes({ config, dimensions, file, mimeType, req, savedFilename, sharp, staticPath, uploadEdits, withMetadata, }: ResizeArgs): Promise<ImageSizesResult>;
export {};
//# sourceMappingURL=imageResizer.d.ts.map