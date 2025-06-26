import { model, Schema } from 'mongoose';
import { IAccess_product } from './access_products.interface';


const Access_Add_Product_Schema = new Schema<IAccess_product>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        product_limit: {
            type: Number,
            default: 0
        },
        added_product: {
            type: Number,
            default: 0
        },
        last_purchase_package: {
            type: Schema.Types.ObjectId,
            ref: "packages"
        },
        expiredAt: {
            type: Date,
            default : new Date()
        }
    },
    {
        timestamps: true,
    },
);

const Access_Products = model<IAccess_product>('access_product', Access_Add_Product_Schema);

export default Access_Products;
