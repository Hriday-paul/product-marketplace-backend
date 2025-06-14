import { IMotorcycle } from "./motorcycle.interface";
import { Motorcycles } from "./motorcycle.model";

const addMotorcycle = async (payload: IMotorcycle) => {

    const res = await Motorcycles.create(payload)

    return res;
}

export const motorcycleService = {
    addMotorcycle
}