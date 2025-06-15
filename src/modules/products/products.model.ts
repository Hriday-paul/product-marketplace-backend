import { model, Model, Schema } from 'mongoose';
import { IProduct } from './products.interface';


export interface productModel extends Model<IProduct> { }

const ProductSchema: Schema<IProduct> = new Schema(
    {
        title: { type: String, required: true },
        images: { type: [String], required: true },
        price: { type: Number, default: 0 },
        sellingPrice: { type: Number, default: 0 },
        details: { type: String, required: true },
        stock: { type: Number, default: 0 },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },

        category: { type: String, enum: ["propertie", "car", "boat", "motorcycle", "bicycle", "job", "book", "furniture", "electronic", "cloth"], required: true },
        condition: { type: String, enum: ["new", "used"], required: true },
        isBoosted: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        productModel: { type: String, enum: ["properties", "cars", "boats", "motorcycles", "jobs", "others"], required: true },
        // otherDetails: { type: Schema.Types.ObjectId, refPath: 'productModel', required: true },
    },
    { discriminatorKey: 'productModel', timestamps: true },
);

export const Products = model<IProduct, productModel>('products', ProductSchema);