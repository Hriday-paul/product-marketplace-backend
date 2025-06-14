import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { IProduct } from "./products.interface";
import { Products } from "./products.model";
import httpStatus from 'http-status'

const allProducts = async (query: Record<string, any>) => {
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const search = query?.searchTerm || "";
    const category = query?.category || null;

    const filters: any = {
        title: { $regex: search, $options: "i" }, // text search
    };
    if (category) filters.category = category;

    const products = await Products.aggregate([
        // 1. Match by filters
        { $match: filters },

        // 2. Lookup reviews
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "product",
                as: "reviews"
            }
        },

        // 3. Add avgRating and reviewCount directly from "reviews"
        {
            $addFields: {
                avgRating: {
                    $cond: [
                        { $gt: [{ $size: "$reviews" }, 0] },
                        { $avg: "$reviews.rating" },
                        0
                    ]
                },
                reviewCount: { $size: "$reviews" }
            }
        },

        // 4. Pagination
        { $skip: skip },
        { $limit: limit },

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
    const product = await Products.findOne({ _id: productId, isDeleted: false });

    if (!product) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Product not found',
        );
    }

    return product
}

const addProduct = async (payload: IProduct, images: string[]) => {

    const res = await Products.create({ ...payload, images: images })

    return res;
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


const deleteProduct = async (productId: string) => {

    const isExist = await Products.findById(productId)

    if (!isExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Product not found',
        );
    }

    const res = await Products.updateOne({ _id: productId }, { isDeleted: true });

    return res;
};

export const productService = {
    allProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    singleProduct
}