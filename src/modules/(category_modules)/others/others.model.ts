import { Model, Schema } from 'mongoose';
import { IOtherProduct } from './others.interface';
import { Products } from '../../products/products.model';

export interface otherProductModel extends Model<IOtherProduct> { }

const OtherProductSchema: Schema<IOtherProduct> = new Schema(
    {
        
        brand: { type: String, required: false },
        sykkelType : { type: String, required: false },
        address: { type: String, required: false },
    }
);

export const OthersProduct: Model<IOtherProduct> = Products.discriminator<IOtherProduct>('others', OtherProductSchema);