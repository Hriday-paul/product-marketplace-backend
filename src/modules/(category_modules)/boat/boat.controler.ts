import config from "../../../config";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from 'http-status';
import { productService } from "../../products/products.service";
import AppError from "../../../error/AppError";
import { boatService } from "./boat.service";
import { access_productService } from "../../access_product/access_products.service";

const addBoat = catchAsync(async (req, res) => {

    const files = req.files as Express.Multer.File[];

    const filePaths = files.map(file => {
        return file?.filename && (config.BASE_URL + '/images/' + file.filename) || '';
    });

    if (filePaths?.length <= 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Minimum 1 image is required',
        );
    }

    const user = req.user._id;
    req.body.user = user
    req.body.isBoosted = false
    req.body.isDeleted = false
    req.body.productModel = "boats"
    req.body.category = "boat"
    req.body.images = filePaths

    req.body.location = { type: "Point", coordinates: [req.body.long, req.body.lat] }

    // ---------------check access to add product-----------
    await access_productService.checkAccess(req.user._id)

    //-----------------------add product--------------
    const result = await boatService.addBoat(req.body, req.user._id);

    // ------------send notification----------------
    await productService.sendNotificationAfterAddProduct(req.user._id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'new product added successfully',
        data: result,
    });
})

export const boatControler = {
    addBoat,
}