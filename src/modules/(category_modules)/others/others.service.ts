import { IOtherProduct } from "./others.interface";
import { OthersProduct } from "./others.model";


const addOtherProduct = async (payload: IOtherProduct) => {
    const res = await OthersProduct.create(payload)
    return res;
}

export const othersProductService = {
    addOtherProduct
}