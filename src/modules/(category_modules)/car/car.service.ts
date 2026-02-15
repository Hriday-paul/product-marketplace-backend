import { IProduct } from "../../products/products.interface";
import { IBobil, ICaravan } from "./car.interface";
import { Bobil, Caravan, CarModel } from "./car.model";

const addCar = async (body: IProduct) => {

    const { isPremium, boostActivatedAt, boostExpiresAt, createdAt, updatedAt, isDeleted, isPaid, ...payload } = body;

    const res = await CarModel.create(payload)

    return res;
}

const addCaravan = async (body: IProduct) => {

    const { isPremium, boostActivatedAt, boostExpiresAt, createdAt, updatedAt, isDeleted, isPaid, ...payload } = body;

    const res = await Caravan.create(payload)

    return res;
}

const addBobil = async (body: IProduct) => {

    const { isPremium, boostActivatedAt, boostExpiresAt, createdAt, updatedAt, isDeleted, isPaid, ...payload } = body;

    const res = await Bobil.create(payload)

    return res;
}

export const carService = {
    addCar,
    addCaravan,
    addBobil
}