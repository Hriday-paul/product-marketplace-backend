import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import AppError from '../../../error/AppError';
import sendResponse from '../../../utils/sendResponse';
import { propertyService } from './property.service';
import { access_productService } from '../../access_product/access_products.service';
import { uploadManyToS3 } from '../../../utils/s3';

const addPropertySell = catchAsync(async (req, res) => {

    const files = req.files as Express.Multer.File[];

    let filePaths: string[] = [];

    // ---------------check access to add product-----------
    await access_productService.checkAccess(req.user._id)

    if (files) {
        const imgsArray: { file: any; path: string; key?: string }[] = [];

        files?.map(image => {
            imgsArray.push({
                file: image,
                path: `images/products/images`,
            });
        });

        const urls = await uploadManyToS3(imgsArray);
        filePaths = urls?.map(i => i?.url);
    }

    if (filePaths?.length <= 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Minimum 1 image is required',
        );
    }

    const user = req.user._id;
    req.body.user = user
    req.body.images = filePaths
    req.body.isBoosted = false
    req.body.isDeleted = false
    req.body.productModel = "properties_sell"
    req.body.category = "propertie"

    req.body.location = { type: "Point", coordinates: [req.body.long, req.body.lat] };

    const result = await propertyService.addPropertySell(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'new property added successfully',
        data: result,
    });
});

const addPropertyRent = catchAsync(async (req, res) => {

    const files = req.files as Express.Multer.File[];

    let filePaths: string[] = [];

    // ---------------check access to add product-----------
    await access_productService.checkAccess(req.user._id)

    if (files) {
        const imgsArray: { file: any; path: string; key?: string }[] = [];

        files?.map(image => {
            imgsArray.push({
                file: image,
                path: `images/products/images`,
            });
        });

        const urls = await uploadManyToS3(imgsArray);
        filePaths = urls?.map(i => i?.url);
    }

    if (filePaths?.length <= 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Minimum 1 image is required',
        );
    }

    const user = req.user._id;
    req.body.user = user
    req.body.images = filePaths
    req.body.isBoosted = false
    req.body.isDeleted = false
    req.body.productModel = "properties_rent"
    req.body.category = "propertie"
    req.body.price = 0

    req.body.location = { type: "Point", coordinates: [req.body.long, req.body.lat] }

    const result = await propertyService.addPropertyRent(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'new property added successfully',
        data: result,
    });
})

export const propertyControler = {
    addPropertySell,
    addPropertyRent
}