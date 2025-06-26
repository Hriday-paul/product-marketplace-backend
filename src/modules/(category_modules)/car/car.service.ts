import { IBobil, ICar, ICaravan } from "./car.interface";
import { Bobil, Caravan, CarModel } from "./car.model";

const addCar = async (payload: ICar) => {

    const res = await CarModel.create(payload)

    return res;
}

const addCaravan = async (payload: ICaravan) => {

    const res = await Caravan.create(payload)

    return res;
}

const addBobil = async (payload: IBobil) => {

    const res = await Bobil.create(payload)

    return res;
}

export const carService = {
    addCar,
    addCaravan,
    addBobil
}