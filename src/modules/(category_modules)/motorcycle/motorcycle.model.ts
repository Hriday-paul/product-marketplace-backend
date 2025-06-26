import { model, Model, Schema } from 'mongoose';
import { IMotorcycle } from './motorcycle.interface';
import { Products } from '../../products/products.model';


export interface motorcycleModel extends Model<IMotorcycle> { }

const MotorCycleSchema: Schema<IMotorcycle> = new Schema(
    {
        registrationNumber: { type: String, required: false },
        chassisNumber: { type: String, required: false },
        brand: { type: String, required: false },
        model: { type: String, required: false },
        motorcycleType: { type: String, required: true }, // required
        modelYear: { type: Number, required: false },
        fuel: { type: String, required: false },
        horsepower: { type: Number, required: false, default : 0 },
        displacementCCM: { type: Number, required: false, default : 0 },
        weightKg: { type: Number, required: false, default : 0 },
        color: { type: String, required: false },

        equipment: { type: [String], default: [] },

        mileage: { type: Number, required: false, default : 0 },
        numberOfOwners: { type: Number, required: false, default : 0 },
        hasConditionReport: { type: Boolean, required: false, default : false },
        hasMaintenance: { type: Boolean, required: false, default : false },
        warrantyType: { type: String, required: false },
        video: { type: String, required : false },
      
        reRegistrationFeeInNOK: { type: Number, required : false, default : 0 },
        exemptFromReRegistrationFee: { type: Boolean, required: false, default : false },

         sellingPriceNOK : {type : Number, required : true, default : 0},
        
        phoneNumber: { type: String, required: false },
        address: { type: String, required: true } // required
    }
);

export const Motorcycles: Model<IMotorcycle> = Products.discriminator<IMotorcycle>('motorcycles', MotorCycleSchema);
// export const Motorcycles = model<IMotorcycle, motorcycleModel>('motorcycles', MotorCycleSchema);