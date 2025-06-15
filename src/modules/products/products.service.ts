import AppError from "../../error/AppError";
import { User } from "../user/user.models";
import { IProduct } from "./products.interface";
import { Products } from "./products.model";
import httpStatus from 'http-status'
import { ObjectId } from "mongodb"

const allProducts = async (query: Record<string, any>) => {
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const search = query?.searchTerm || "";
    const category = query?.category || null;
    const condition = query?.condition || null;

    const filters: any = {
        title: { $regex: search, $options: "i" }, // text search
    };
    if (category) filters.category = category;
    if (condition) filters.condition = condition;
    filters.isDeleted = false;

    const products = await Products.aggregate([
        // 1. Match by filters
        { $match: filters },

        // 2. Lookup reviews
        // {
        //     $lookup: {
        //         from: "reviews",
        //         localField: "_id",
        //         foreignField: "product",
        //         as: "reviews"
        //     }
        // },

        // 3. Add avgRating and reviewCount directly from "reviews"
        // {
        //     $addFields: {
        //         avgRating: {
        //             $cond: [
        //                 { $gt: [{ $size: "$reviews" }, 0] },
        //                 { $avg: "$reviews.rating" },
        //                 0
        //             ]
        //         },
        //         reviewCount: { $size: "$reviews" }
        //     }
        // },

        // 2. Lookup aggregated review data
        {
            $lookup: {
                from: "reviews",
                let: { productId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$product", "$$productId"] } } },
                    {
                        $group: {
                            _id: null,
                            avgRating: { $avg: "$rating" },
                            reviewCount: { $sum: 1 }
                        }
                    }
                ],
                as: "reviewStats"
            }
        },

        // 3. Add avgRating and reviewCount safely
        {
            $addFields: {
                avgRating: {
                    $ifNull: [{ $arrayElemAt: ["$reviewStats.avgRating", 0] }, 0]
                },
                reviewCount: {
                    $ifNull: [{ $arrayElemAt: ["$reviewStats.reviewCount", 0] }, 0]
                }
            }
        },

        // 4. Pagination
        { $skip: skip },
        { $limit: limit },
        { $sort: { isBoosted: -1 } },

        // 5. Optional projection
        // {
        //   $project: {
        //     name: 1,
        //     price: 1,
        //     category: 1,
        //     avgRating: 1,
        //     reviewCount: 1,
        //     reviews: 1,
        //     image: 1
        //   }
        // },

        // {
        //     $lookup: {
        //         from: "users",
        //         localField: "user",
        //         foreignField: "_id",
        //         as: "user",
        //     },
        // },
        // { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    ]);

    const total = await Products.countDocuments(filters);

    const totalPage = Math.ceil(total / limit);

    const meta = {
        page,
        limit,
        total,
        totalPage,
    };

    return { data: products, meta }
}

const myProducts = async (query: Record<string, any>, userId: string) => {

    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const search = query?.searchTerm || "";
    const category = query?.category || null;
    const condition = query?.condition || null;

    const filters: any = {
        title: { $regex: search, $options: "i" }, // text search
    };
    if (category) filters.category = category;
    if (condition) filters.condition = condition;
    filters.isDeleted = false;

    filters.user = new ObjectId(userId);

    const products = await Products.aggregate([
        // 1. Match by filters
        { $match: filters },

        // 2. Lookup reviews
        // {
        //     $lookup: {
        //         from: "reviews",
        //         localField: "_id",
        //         foreignField: "product",
        //         as: "reviews"
        //     }
        // },

        // 3. Add avgRating and reviewCount directly from "reviews"
        // {
        //     $addFields: {
        //         avgRating: {
        //             $cond: [
        //                 { $gt: [{ $size: "$reviews" }, 0] },
        //                 { $avg: "$reviews.rating" },
        //                 0
        //             ]
        //         },
        //         reviewCount: { $size: "$reviews" }
        //     }
        // },

        // 2. Lookup aggregated review data
        {
            $lookup: {
                from: "reviews",
                let: { productId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$product", "$$productId"] } } },
                    {
                        $group: {
                            _id: null,
                            avgRating: { $avg: "$rating" },
                            reviewCount: { $sum: 1 }
                        }
                    }
                ],
                as: "reviewStats"
            }
        },

        // 3. Add avgRating and reviewCount safely
        {
            $addFields: {
                avgRating: {
                    $ifNull: [{ $arrayElemAt: ["$reviewStats.avgRating", 0] }, 0]
                },
                reviewCount: {
                    $ifNull: [{ $arrayElemAt: ["$reviewStats.reviewCount", 0] }, 0]
                }
            }
        },

        // 4. Pagination
        { $skip: skip },
        { $limit: limit },
        { $sort: { isBoosted: -1 } },

        // 5. Optional projection
        // {
        //   $project: {
        //     name: 1,
        //     price: 1,
        //     category: 1,
        //     avgRating: 1,
        //     reviewCount: 1,
        //     reviews: 1,
        //     image: 1
        //   }
        // },

        // {
        //     $lookup: {
        //         from: "users",
        //         localField: "user",
        //         foreignField: "_id",
        //         as: "user",
        //     },
        // },
        // { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    ]);

    const total = await Products.countDocuments(filters);

    const totalPage = Math.ceil(total / limit);

    const meta = {
        page,
        limit,
        total,
        totalPage,
    };

    return { data: products, meta }
}

const singleProduct = async (productId: string) => {

    const product = await Products.aggregate([
        { $match: { _id: new ObjectId(productId), isDeleted: false } },

        // Lookup and aggregate review data
        {
            $lookup: {
                from: "reviews",
                let: { productId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$product", "$$productId"] } } },
                    {
                        $group: {
                            _id: null,
                            avgRating: { $avg: "$rating" },
                            reviewCount: { $sum: 1 },
                        },
                    },
                ],
                as: "reviewStats",
            },
        },

        // Add fields
        {
            $addFields: {
                avgRating: {
                    $ifNull: [{ $arrayElemAt: ["$reviewStats.avgRating", 0] }, 0],
                },
                reviewCount: {
                    $ifNull: [{ $arrayElemAt: ["$reviewStats.reviewCount", 0] }, 0],
                },
            },
        },

        { $unset: "reviewStats" },

        { $limit: 1 }, // ✅ only one document

        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    ]);


    if (!product[0]) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Product not found',
        );
    }

    return product[0]
}

const relatedProducts = async (productId: string) => {

    const product = await Products.findOne({ _id: productId });

    if (!product) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Main Product not found',
        );
    }

    const products = await Products.aggregate([
        // 1. Match by filters
        { $match: { category: product?.category, isDeleted: false, _id: { $ne: product._id } } },

        {
            $lookup: {
                from: "reviews",
                let: { productId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$product", "$$productId"] } } },
                    {
                        $group: {
                            _id: null,
                            avgRating: { $avg: "$rating" },
                            reviewCount: { $sum: 1 }
                        }
                    }
                ],
                as: "reviewStats"
            }
        },

        // 3. Add avgRating and reviewCount safely
        {
            $addFields: {
                avgRating: {
                    $ifNull: [{ $arrayElemAt: ["$reviewStats.avgRating", 0] }, 0]
                },
                reviewCount: {
                    $ifNull: [{ $arrayElemAt: ["$reviewStats.reviewCount", 0] }, 0]
                }
            }
        },
        // { $limit: limit },
        { $sort: { isBoosted: -1 } },
    ]);

    return products;
}

const nearMeProducts = async (userId: string) => {
    const user = await User.findOne({ _id: userId });

    if (!user) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'User not found',
        );
    }

    const userLocation: { type: "Point"; coordinates: [number, number] } = {
        type: "Point",
        coordinates: [user?.long, user?.lat], // [longitude, latitude]
    };

    const products = await Products.aggregate([
        {
            $geoNear: {
                near: userLocation,
                distanceField: "distance",
                maxDistance: 50000,   // optional: 50km radius (in meters)
                spherical: true,
                query: { isDeleted: false }
            }
        },

        {
            $lookup: {
                from: "reviews",
                let: { productId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$product", "$$productId"] } } },
                    {
                        $group: {
                            _id: null,
                            avgRating: { $avg: "$rating" },
                            reviewCount: { $sum: 1 }
                        }
                    }
                ],
                as: "reviewStats"
            }
        },

        // 3. Add avgRating and reviewCount safely
        {
            $addFields: {
                avgRating: {
                    $ifNull: [{ $arrayElemAt: ["$reviewStats.avgRating", 0] }, 0]
                },
                reviewCount: {
                    $ifNull: [{ $arrayElemAt: ["$reviewStats.reviewCount", 0] }, 0]
                }
            }
        },

        // { $limit: 20 },
        { $sort: { isBoosted: -1 } },
    ]);

    return products;
}

interface upPRod extends IProduct {
    existImages: string[]
}

const updateProduct = async (payload: upPRod, productId: string, newImages: string[]) => {

    const { details, title, price, stock, existImages } = payload

    const updateFields: Partial<IProduct> = { details, title, price, stock };


    // Remove undefined or null fields to prevent overwriting existing values with null
    Object.keys(updateFields).forEach((key) => {
        if (updateFields[key as keyof IProduct] === undefined || updateFields[key as keyof IProduct] === '' || updateFields[key as keyof IProduct] === null) {
            delete updateFields[key as keyof IProduct];
        }
    });

    if (Object.keys(updateFields).length === 0) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'No valid field found',
        );
    }

    const isExist = await Products.findById(productId)

    if (!isExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Product not found',
        );
    }

    const existImg = JSON.parse(existImages as unknown as string)

    if (newImages) {
        updateFields.images = [...existImg, ...newImages];
    } else {
        updateFields.images = [...existImg];
    }


    const result = await Products.updateOne({ _id: productId }, updateFields)

    if (result?.modifiedCount <= 0) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Product update failed, try again',
        );
    }

    return result

}


const deleteProduct = async (productId: string, userId: string) => {

    const isExist = await Products.findById(productId)

    if (!isExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Product not found',
        );
    }

    //check is owner
    if (isExist?.user.toString() !== userId) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'You have not access to delete',
        );
    }

    const res = await Products.updateOne({ _id: productId }, { isDeleted: true });

    return res;
};

export const productService = {
    allProducts,
    myProducts,
    relatedProducts,
    nearMeProducts,
    updateProduct,
    deleteProduct,
    singleProduct
}