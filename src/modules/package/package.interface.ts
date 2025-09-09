import { Types } from "mongoose";

export interface IPackage {
    _id: Types.ObjectId;
    title: string;
    product_limit: number,
    duration_day: number
    price: number;
    isDeleted ?: boolean;
    category : "propertie_sell" | "propertie_rent" | "car" | "boat" | "motorcycle" | "bicycle" | "job" | "book" | "furniture" | "electronic" | "cloth" | "caravan" | "bobil"
}