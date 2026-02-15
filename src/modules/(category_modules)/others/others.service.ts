import { IProduct } from "../../products/products.interface";
import { IOtherProduct } from "./others.interface";
import { OthersProduct } from "./others.model";


const addOtherProduct = async (body: IProduct) => {

    const { isPremium, boostActivatedAt, boostExpiresAt, createdAt, updatedAt, isDeleted, isPaid, ...payload } = body;

    const res = await OthersProduct.create(payload)
    return res;
}

export const othersProductService = {
    addOtherProduct
}