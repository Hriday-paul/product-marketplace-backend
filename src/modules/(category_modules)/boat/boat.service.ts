import { IProduct } from "../../products/products.interface";
import { Boat } from "./boat.model";

const addBoat = async (body: IProduct) => {

    const { isPremium, boostActivatedAt, boostExpiresAt, createdAt, updatedAt, isDeleted, isPaid, ...payload } = body;

    const res = await Boat.create(payload);

    return res;
}

export const boatService = {
    addBoat
}