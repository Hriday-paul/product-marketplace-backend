import { Model, model, Schema } from 'mongoose';
import { IPackage } from './package.interface';

export interface IPackageModel extends Model<IPackage> { }

const PackageSchema = new Schema<IPackage>(
    {
        title: { type: String },
        price: { type: Number, required: true, min: 0 },
        product_limit: { type: Number, required: true, min: 0 },
        
        category: { type: String, required: true, enum: ["propertie_sell", "propertie_rent", "car", "boat", "motorcycle", "bicycle", "job", "book", "furniture", "electronic", "cloth", "caravan", "bobil"] },

        duration_day: {
            type: Number,
            required: true,
            min: 1,
        },
        isDeleted: { type: Boolean, default: false },
    },
    {
        _id: true,
        timestamps: true,
    },
);

const Package = model<IPackage, IPackageModel>('packages', PackageSchema);

export default Package;
