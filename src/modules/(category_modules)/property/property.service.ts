import { IProduct } from "../../products/products.interface";
import { IPropertyRent } from "./property.interface";
import { PropertyRentModel } from "./propertyrent.model";
import { PropertySellModel } from "./propertysell.model";

const addPropertySell = async (body: IProduct) => {

    const { isPremium, boostActivatedAt, boostExpiresAt, createdAt, updatedAt, isDeleted, isPaid, ...payload } = body;

    const res = await PropertySellModel.create(payload)

    return res;
}

const addPropertyRent = async (body: IProduct) => {

    const { isPremium, boostActivatedAt, boostExpiresAt, createdAt, updatedAt, isDeleted, isPaid, ...payload } = body;

    const res = await PropertyRentModel.create(payload)

    return res;
}

export const propertyService = {
    addPropertySell,
    addPropertyRent
}