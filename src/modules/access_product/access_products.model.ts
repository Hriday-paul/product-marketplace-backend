import { model, Schema } from 'mongoose';
import { IAccess_product, IPurchasePack } from './access_products.interface';

const Package_Schema = new Schema<IPurchasePack>(
    {
        last_purchase_package: {
            type: Schema.Types.ObjectId,
            ref: "packages"
        },

        category: { type: String, required: true, enum: ["propertie_sell", "propertie_rent", "car", "boat", "motorcycle", "bicycle", "job", "book", "furniture", "electronic", "cloth", "caravan", "bobil"] },

        product_limit: {
            type: Number,
            default: 0
        },
        added_product: {
            type: Number,
            default: 0
        },
        expiredAt: {
            type: Date,
            default: new Date()
        }
    }
)


const Access_Add_Product_Schema = new Schema<IAccess_product>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        purchasePackages: { type: [Package_Schema] }
    },
    {
        timestamps: true,
    },
);

const Access_Products = model<IAccess_product>('access_product', Access_Add_Product_Schema);

export default Access_Products;
