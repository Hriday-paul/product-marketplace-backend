import { ObjectId } from "mongoose";

export interface IProduct {
    title: string;
    category: "propertie" | "car" | "boat" | "motorcycle" | "bicycle" | "job" | "book" | "furniture" | "electronic" | "cloth" | "caravan" | "bobil",
    productModel : "properties_sell" | "properties_rent" | "cars" | "boats" | "motorcycles" | "jobs" | "others" | "caravans" | "bobils",
    condition: "new" | "used"
    images: string[],
    brand: string,
    price: number,
    sellingPrice: number,
    stock: number,
    details: string,
    location : {type : string, coordinates : number[]}
    isBoosted ?: boolean,
    isDeleted ?: boolean,
    user ?: ObjectId,
    // otherDetails?: ObjectId,
}