import AppError from "../../error/AppError";
import { sendNotification } from "../notification/notification.utils";
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
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$product", "$$productId"] },
                                    { $eq: ["$isDeleted", false] }
                                ]
                            }
                        }
                    },
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
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$product", "$$productId"] },
                                    { $eq: ["$isDeleted", false] }
                                ]
                            }
                        }
                    },
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
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$product", "$$productId"] },
                                    { $eq: ["$isDeleted", false] }
                                ]
                            }
                        }
                    },
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
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$product", "$$productId"] },
                                    { $eq: ["$isDeleted", false] }
                                ]
                            }
                        }
                    },
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
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$product", "$$productId"] },
                                    { $eq: ["$isDeleted", false] }
                                ]
                            }
                        }
                    },
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
    existImages?: string[],
    lat?: number;
    long?: number;
}

const updateProduct = async (payload: upPRod, productId: string, newImages: string[]) => {

    if (Object.keys(payload).length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'No valid fields to update');
    }

    const isExist = await Products.findById(productId);
    if (!isExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    // Build updated images array
    const existingImages = payload.existImages || [];
    payload.images = [...existingImages, ...newImages];

    // Remove existImages from payload to avoid saving unknown fields
    delete payload?.existImages;
    delete payload?.isBoosted;
    delete payload?.isDeleted;
    delete payload?.user;


    if (typeof payload.lat === 'number' || typeof payload.long === 'number') {

        const [currentLong, currentLat] = isExist.location.coordinates;

        const updatedLat = typeof payload.lat === 'number' ? payload.lat : currentLat;
        const updatedLong = typeof payload.long === 'number' ? payload.long : currentLong;

        payload.location = {
            type: 'Point',
            coordinates: [updatedLong, updatedLat],
        };

        // Remove lat & long from payload to avoid storing them directly
        delete payload.lat;
        delete payload.long;
    }




    // Update the product
    const result = await Products.updateOne(
        { _id: productId },
        { $set: payload },
        {runValidators: true}
    );

    if (result.modifiedCount <= 0) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Product update failed, try again'
        );
    }

    return result;

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
    if (isExist?.user?.toString() !== userId) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'You have not access to delete',
        );
    }

    const res = await Products.updateOne({ _id: productId }, { isDeleted: true });

    return res;
};

const sendNotificationAfterAddProduct = async (userId: string) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'User not found',
        );
    }

    // get FCM token to use
    const tokenToUse = user?.fcmToken;

    // Send notification if FCM token exists and user notification is unabled
    if (tokenToUse && user?.notification) {
        sendNotification([tokenToUse], {
            title: `Product added successfully`,
            message: `New product added successfully`,
            receiver: user._id,
            receiverEmail: user.email,
            receiverRole: user.role,
            sender: user._id,
            type: "product"
        });
    }
}

export const productService = {
    allProducts,
    myProducts,
    relatedProducts,
    nearMeProducts,
    updateProduct,
    deleteProduct,
    singleProduct,
    sendNotificationAfterAddProduct
}