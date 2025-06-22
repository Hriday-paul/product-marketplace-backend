import { IPropertyRent, IPropertySell } from "./property.interface";
import { PropertyRentModel } from "./propertyrent.model";
import { PropertySellModel } from "./propertysell.model";

const addPropertySell = async (payload: IPropertySell) => {

    const res = await PropertySellModel.create(payload)

    return res;
}

const addPropertyRent = async (payload: IPropertyRent) => {

    const res = await PropertyRentModel.create(payload)

    return res;
}

export const propertyService = {
    addPropertySell,
    addPropertyRent
}