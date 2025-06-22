import { IBoat } from "./boat.interface";
import { Boat } from "./boat.model";

const addBoat = async (payload: IBoat, user : string) => {

    const res = await Boat.create(payload);

    return res;
}

export const boatService = {
    addBoat
}