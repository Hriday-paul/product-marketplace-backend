
import { Types } from "mongoose";

export interface IPurchasePack {
    last_purchase_package: Types.ObjectId,
    product_limit: number,
    added_product: number,
    expiredAt: Date,
    category : "propertie_sell" | "propertie_rent" | "car" | "boat" | "motorcycle" | "bicycle" | "job" | "book" | "furniture" | "electronic" | "cloth" | "caravan" | "bobil"
}

export interface IAccess_product {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    purchasePackages: IPurchasePack[]
}