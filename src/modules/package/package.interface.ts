import { Types } from "mongoose";

export interface IPackage {
    _id: Types.ObjectId;
    title: string;
    product_limit: number,
    duration_day: number
    price: number;
    isDeleted ?: boolean
}