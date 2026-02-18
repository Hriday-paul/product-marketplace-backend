import { Types } from "mongoose";
import AppError from "../../error/AppError";
import { sendMultipleNotification, sendNotification } from "../notification/notification.utils";
import Search from "../searches/searches.model";
import { User } from "../user/user.models";
import { IProduct } from "./products.interface";
import { Products } from "./products.model";
import httpStatus from 'http-status'
import { ObjectId } from "mongodb"
import { INotification } from "../notification/notification.inerface";

const allProducts = async (query: Record<string, any>) => {
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const q_sort = query?.sort;
    const search = query?.searchTerm || "";
    const category = query?.category || null;
    const condition = query?.condition || null;

    const lat = query?.lat ? parseFloat(query.lat) : null;
    const long = query?.long ? parseFloat(query.long) : null;
    const distance = query?.distance ? parseFloat(query.distance) : 10;

    /* ---------------- FILTERS ---------------- */
    const filters: any = {
        isDeleted: false,
        isPaid: true
    };

    if (search) {
        filters.title = { $regex: search, $options: "i" };
    }

    if (category) filters.category = category;
    if (condition) filters.condition = condition;

    const hasMin = query?.min !== undefined && query?.min !== null;
    const hasMax = query?.max !== undefined && query?.max !== null;

    if (hasMin && hasMax) {
        filters.price = { $gte: Number(query.min), $lte: Number(query.max) };
    } else if (hasMin) {
        filters.price = { $gte: Number(query.min) };
    } else if (hasMax) {
        filters.price = { $lte: Number(query.max) };
    }

    /* ---------------- SORT ---------------- */
    const sort: any = { isPremium: -1 };

    if (q_sort === "priceAsc") sort.price = 1;
    else if (q_sort === "priceDsc") sort.price = -1;
    else if (q_sort === "createdAtAsc") sort.createdAt = 1;
    else if (q_sort === "closestAsc" && lat && long) sort.distance = 1;
    else if (q_sort === "closestDsc" && lat && long) sort.distance = -1;

    else sort.createdAt = -1;


    /* ---------------- PIPELINE ---------------- */
    const pipeline: any[] = [];

    // ✅ CLOSEST (geo sorting)
    if (lat && long) {
        pipeline.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [long, lat],
                },
                distanceField: "distance", // meters
                maxDistance: (distance ?? 10) * 1000, // 10km
                spherical: true,
                query: filters,
            },
        });
    } else {
        pipeline.push({ $match: filters });
    }

    // 🔍 Review aggregation
    pipeline.push(
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
                                    { $eq: ["$isDeleted", false] },
                                ],
                            },
                        },
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
        {
            $addFields: {
                avgRating: {
                    $ifNull: [{ $arrayElemAt: ["$reviewStats.avgRating", 0] }, 0],
                },
                reviewCount: {
                    $ifNull: [{ $arrayElemAt: ["$reviewStats.reviewCount", 0] }, 0],
                },
            },
        }
    );

    // ✅ Pagination (correct order)
    pipeline.push(
        { $sort: sort },
        { $skip: skip },
        { $limit: limit }
    );

    /* ---------------- QUERY ---------------- */
    const products = await Products.aggregate(pipeline);

    const total = await Products.countDocuments(filters);
    const totalPage = Math.ceil(total / limit);

    return {
        data: products,
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
    };
};


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
    filters.isPaid = true;

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
        { $sort: { createdAt: -1 } },

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

const topViewsProduct = async () => {

    const res = await Products.find({ isDeleted: false, isPaid: true }).sort({ isPremium: -1, total_views: -1 }).limit(10).select('_id title images price sellingPrice details category condition');

    return res;

}

const singleProduct = async (productId: string, userId: string) => {

    await Products.updateOne({ _id: productId }, { $inc: { total_views: 1 } });

    const product = await Products.aggregate([

        { $match: { _id: new ObjectId(productId), isDeleted: false, isPaid: true } },

        {
            $lookup: {
                from: "favourites",
                let: { productId: "$_id", userId: new ObjectId(userId) },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$product", "$$productId"] },
                                    { $eq: ["$user", "$$userId"] },
                                ]
                            }
                        }
                    },
                    { $limit: 1 } // we only need to know if it exists
                ],
                as: "favouriteStatus"
            }
        },
        {
            $addFields: {
                isFavourite: { $gt: [{ $size: "$favouriteStatus" }, 0] }
            }
        },
        { $unset: "favouriteStatus" },


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

        { $limit: 1 },

        {
            $lookup: {
                from: "users",
                let: { userId: "$user" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$userId"] }
                        }
                    },
                    {
                        $project: {
                            password: 0,
                            email: 0,
                            fcmToken: 0
                        }
                    }
                ],
                as: "user"
            }
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
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
            'Main Listing not found',
        );
    }

    const products = await Products.aggregate([
        // 1. Match by filters
        { $match: { category: product?.category, isDeleted: false, isPaid: true, _id: { $ne: product._id } } },

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
        { $sort: { isPremium: -1, createdAt: -1 } },
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
            $match: {
                isDeleted: false,
                isPaid: true
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
        { $sort: { isPremium: -1, createdAt: -1 } },
    ]);

    return products;
}

interface upPRod extends IProduct {
    existImages?: string[],
    lat?: number;
    long?: number;
}

const updateProduct = async (body: upPRod, productId: string, newImages: string[]) => {

    const { isPremium, boostActivatedAt, boostExpiresAt, createdAt, updatedAt, isDeleted, user, isPaid, ...payload } = body;

    if (Object.keys(payload).length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'No valid fields to update');
    }

    const isExist = await Products.findById(productId);
    if (!isExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    // check item is paid and isdeleted
    if (!isExist?.isPaid || isExist?.isDeleted) {
        throw new AppError(httpStatus.CONFLICT, 'Item unavailble for update');
    }

    // Build updated images array
    const existingImages = payload.existImages || [];
    payload.images = [...existingImages, ...newImages];

    // Remove existImages from payload to avoid saving unknown fields
    delete payload?.existImages;


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
        { runValidators: true }
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

    if (!isExist?.isPaid || isExist?.isDeleted) {
        throw new AppError(httpStatus.CONFLICT, 'Item unavailble for update');
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

const sendNotificationAfterAddProduct = async (userId: string, productId: ObjectId) => {

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
    // for product owner

    sendNotification(tokenToUse ? [tokenToUse] : [], {
        title: `Listing added successfully`,
        message: `New Listing added successfully`,
        receiver: user._id,
        receiverEmail: user.email,
        receiverRole: user.role,
        sender: user._id,
        type: "text"
    }, user.notification);


    // for match search

    const product = await Products.findOne({ _id: new Types.ObjectId(productId), isDeleted: false, isPaid: true });

    if (!product) return;

    const filters: any = {
        $and: [
            { $or: [{ category: product.category }, { category: null }, { category: { $exists: false } }] },
            { $or: [{ condition: product.condition }, { condition: null }, { condition: { $exists: false } }] },
            { $or: [{ "price.min": { $lte: product.price } }, { price: null }, { "price.min": { $exists: false } }] },
            { $or: [{ "price.max": { $gte: product.price } }, { price: null }, { "price.max": { $exists: false } }] },
            // { $or: [{ search: { $regex: product.title, $options: "i" } }, { search: { $exists: false } }, { search: null }] },
            {
                $or: [
                    {
                        location: {
                            $geoWithin: {
                                $centerSphere: [
                                    product.location.coordinates,
                                    50 / 6378.1 // Convert 50km to radians (Earth radius ~6378.1 km)
                                ]
                            }
                        }
                    },
                    { location: null },
                    { location: { $exists: false } }
                ]
            }
        ]
    };

    const matchingSearches = await Search.find(filters).populate({ path: "user", select: "-password" });

    const tokens = [];
    const notifications: INotification[] = []

    for (const search of matchingSearches) {

        (search?.user?.fcmToken && search?.user.notification) && tokens.push(search?.user?.fcmToken);

        notifications.push({
            title: `New Listing Launched`,
            message: `New listing found based on your saved search`,
            receiver: search?.user?._id,
            receiverEmail: search?.user?.email,
            receiverRole: search?.user?.role,
            sender: userId as any,
            type: "product",
            product: product?._id,
        })

    }

    sendMultipleNotification(tokens, notifications, { title: "New Listing Launched", message: "New listing found based on your saved search" });

    return null;
}


export const productService = {
    allProducts,
    myProducts,
    relatedProducts,
    nearMeProducts,
    updateProduct,
    deleteProduct,
    singleProduct,
    sendNotificationAfterAddProduct,
    topViewsProduct
}