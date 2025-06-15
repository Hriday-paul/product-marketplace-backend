import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { productService } from "./products.service";
import httpStatus from 'http-status'

const allProducts = catchAsync(async (req, res) => {
    const query = req.query
    const result = await productService.allProducts(query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All products fetched successfully',
        data: result,
    });
})

const myProducts = catchAsync(async (req, res) => {
    const query = req.query
    const result = await productService.myProducts(query, req.user._id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My products retrived successfully',
        data: result,
    });
})

const relatedProducts = catchAsync(async (req, res) => {
    const result = await productService.relatedProducts(req.params.id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Related products retrived successfully',
        data: result,
    });
})

const nearMeProducts = catchAsync(async (req, res) => {
    const result = await productService.nearMeProducts(req.user._id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Near me products retrived successfully',
        data: result,
    });
})

const singleProduct = catchAsync(async (req, res) => {
    const result = await productService.singleProduct(req.params.id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Product fetched successfully',
        data: result,
    });
})

const updateProduct = catchAsync(async (req, res) => {

    const files = req.files as Express.Multer.File[];

    const filePaths = files.map(file => {
        return file?.filename && (config.BASE_URL + '/images/' + file.filename) || '';
    });

    

    const result = await productService.updateProduct(req.body, req.params.id, filePaths)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'product updated successfully',
        data: result,
    });
});

const deleteProduct = catchAsync(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id, req.user._id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Product deleted successfully',
        data: result,
    });
});

export const productControler = {
    allProducts,
    myProducts,
    nearMeProducts,
    updateProduct,
    deleteProduct,
    relatedProducts,
    singleProduct
}