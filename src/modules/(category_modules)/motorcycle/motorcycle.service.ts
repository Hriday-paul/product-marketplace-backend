import { IProduct } from "../../products/products.interface";
import { Motorcycles } from "./motorcycle.model";

const addMotorcycle = async (body: IProduct) => {

    const { isPremium, boostActivatedAt, boostExpiresAt, createdAt, updatedAt, isDeleted, isPaid, ...payload } = body;

    const res = await Motorcycles.create(payload)

    return res;
}

export const motorcycleService = {
    addMotorcycle
}