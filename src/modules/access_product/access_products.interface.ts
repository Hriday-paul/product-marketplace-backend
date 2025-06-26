
import { Types } from "mongoose";

export interface IAccess_product {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    last_purchase_package : Types.ObjectId,
    product_limit : number,
    added_product : number,
    expiredAt: Date,
}