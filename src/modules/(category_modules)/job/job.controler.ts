import config from "../../../config";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from 'http-status';
import AppError from "../../../error/AppError";
import { jobService } from "./job.service";
import { productService } from "../../products/products.service";

const addJob = catchAsync(async (req, res) => {

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
    req.body.productModel = "jobs"
    req.body.category = "job"
    req.body.isBoosted = false
    req.body.isDeleted = false
    req.body.condition = "new"
    req.body.images = filePaths

    req.body.location = { type: "Point", coordinates: [req.body.long, req.body.lat] }

    const result = await jobService.addJob(req.body)

    // ------------send notification----------------
    await productService.sendNotificationAfterAddProduct(req.user._id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'new product added successfully',
        data: result,
    });
})

export const jobControler = {
    addJob,
}