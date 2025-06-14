import { ObjectId } from "mongoose";

export interface IReview {
    product: ObjectId,
    product_user: ObjectId,
    reviewer: ObjectId,
    rating: number,
    comment: string
}