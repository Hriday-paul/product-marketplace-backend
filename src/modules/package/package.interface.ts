import { Types } from "mongoose";

export interface IPackage {
    _id: Types.ObjectId;
    title: string;
    type : "basic" | "premium"
    price: number;
    features : string[]
    isDeleted ?: boolean;
    createdAt : Date,
    updatedAt : Date
    category : "propertie_sell" | "propertie_rent" | "car" | "boat" | "motorcycle" | "bicycle" | "job" | "book" | "furniture" | "electronic" | "cloth" | "caravan" | "bobil"
}