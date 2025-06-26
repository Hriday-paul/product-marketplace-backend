import config from "../../../config";
import AppError from "../../../error/AppError";
import catchAsync from "../../../utils/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../../utils/sendResponse";
import { productService } from "../../products/products.service";
import { carService } from "./car.service";


const addCar = catchAsync(async (req, res) => {

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
    req.body.images = filePaths
    req.body.isBoosted = false
    req.body.isDeleted = false
    req.body.productModel = "cars"
    req.body.category = "car"
    req.body.sellingPrice = req.body.price
    req.body.stock = 1

    req.body.location = { type: "Point", coordinates: [req.body.long, req.body.lat] }

    const result = await carService.addCar(req.body);

    // ------------send notification----------------
    await productService.sendNotificationAfterAddProduct(req.user._id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'new car added successfully',
        data: result,
    });
})


const addCaravan = catchAsync(async (req, res) => {

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
    req.body.images = filePaths
    req.body.isBoosted = false
    req.body.isDeleted = false
    req.body.productModel = "caravans"
    req.body.category = "caravan"
    req.body.sellingPrice = req.body.price
    req.body.stock = 1

    req.body.location = { type: "Point", coordinates: [req.body.long, req.body.lat] }

    const result = await carService.addCaravan(req.body);

    // ------------send notification----------------
    await productService.sendNotificationAfterAddProduct(req.user._id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'new caravan added successfully',
        data: result,
    });
})


const addBobil = catchAsync(async (req, res) => {

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
    req.body.images = filePaths
    req.body.isBoosted = false
    req.body.isDeleted = false
    req.body.productModel = "bobils"
    req.body.category = "bobil"
    req.body.sellingPrice = req.body.price
    req.body.stock = 1

    req.body.location = { type: "Point", coordinates: [req.body.long, req.body.lat] }

    const result = await carService.addBobil(req.body);

    // ------------send notification----------------
    await productService.sendNotificationAfterAddProduct(req.user._id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'new bobil added successfully',
        data: result,
    });
})

export const carControler = {
    addCar,
    addCaravan,
    addBobil
}