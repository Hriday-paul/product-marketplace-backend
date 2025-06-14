import { IBoat } from "./boat.interface";
import { Boat } from "./boat.model";

const addBoat = async (payload: IBoat) => {

    const res = await Boat.create(payload)

    return res;
}

export const boatService = {
    addBoat
}