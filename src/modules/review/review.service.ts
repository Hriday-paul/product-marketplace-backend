import AppError from "../../error/AppError";
import { Products } from "../products/products.model";
import { IReview } from "./review.interface";
import { Reviews } from "./review.model";
import httpStatus from 'http-status'

const addReview = async (payload: IReview, reviewer: string) => {

    //check product is available or not ?
    const machedProduct = await Products.findOne({ _id: payload?.product })

    if (!machedProduct) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Product not found',
        );
    }

    payload.isDeleted = false
    payload.isEdited = false

    const res = await Reviews.create({ ...payload, reviewer, product_user: machedProduct?.user })

    return res;
}

const reviewsByProduct = async (productId: string) => {

    const res = await Reviews.find({ product: productId, isDeleted : false }).populate("reviewer");

    return res;
}

const myProductsreviews = async (userId: string) => {

    const res = await Reviews.find({ product_user: userId, isDeleted : false }).populate("reviewer");

    return res;
}

export const reviewService = {
    addReview,
    reviewsByProduct,
    myProductsreviews
}