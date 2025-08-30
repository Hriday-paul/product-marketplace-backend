import mongoose from "mongoose";
import { Favorites } from "./favourites.model";
import AppError from "../../error/AppError";
import httpstatus from "http-status"


const addFavourite = async (product: string, user: string) => {

    const exist = await Favorites.findOne({ product, user });

    if (exist) {
        throw new AppError(httpstatus.FORBIDDEN, "Product already exist to favourite")
    }

    const res = await Favorites.insertOne({ product, user });

    return res;
}

const deletefavourite = async (product: string, user: string) => {

    const exist = await Favorites.findOne({ product, user });

    if (!exist) {
        throw new AppError(httpstatus.NOT_FOUND, "Favourite product not found")
    }

    const res = await Favorites.deleteOne({ product });

    return res;
}

const getAllMyFavourites = async (user: string) => {
    // const res = await Favorites.find({user}).populate({path : "product", populate : {path : "user", select : "-password -email -fcmToken"}})
    // return res

    const favorites = await Favorites.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(user),
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'product',
            },
        },
        { $unwind: '$product' },
        {
            $lookup: {
                from: 'users',
                localField: 'product.user',
                foreignField: '_id',
                as: 'product.user',
            },
        },
        { $unwind: '$product.user' },
        {
            $unset: ['product.user.password', 'product.user.fcmToken', 'product.user.email']
        },
        {
            $lookup: {
                from: 'reviews',
                let: { productId: '$product._id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$product', '$$productId'] },
                                    { $eq: ['$isDeleted', false] },
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            avgRating: { $avg: '$rating' },
                            reviewCount: { $sum: 1 },
                        },
                    },
                ],
                as: 'reviewStats',
            },
        },
        {
            $addFields: {
                'product.avgRating': {
                    $ifNull: [{ $arrayElemAt: ['$reviewStats.avgRating', 0] }, 0],
                },
                'product.reviewCount': {
                    $ifNull: [{ $arrayElemAt: ['$reviewStats.reviewCount', 0] }, 0],
                },
            },
        },
        {
            $project: {
                reviewStats: 0, // hide temp field
            },
        },
    ]);

    return favorites
}

export const favouriteService = {
    addFavourite,
    deletefavourite,
    getAllMyFavourites
}