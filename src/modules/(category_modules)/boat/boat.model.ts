import { model, Model, Schema } from 'mongoose';
import { IBoat } from './boat.interface';
import { Products } from '../../products/products.model';


export interface boatModel extends Model<IBoat> { }

const BoatSchema: Schema<IBoat> = new Schema(
    {
        typeOfBoat: { type: String, required: true }, //required
        registrationNumber: { type: String, required: false },
        modelYear: { type: Number, required: true }, //required
        brand: { type: String, required: false },
        boatLocation: { type: String, required: false },
        hasMotor: { type: Boolean, required: false },
        engineBrand: { type: String, required: false },
        engineType: { type: String, required: false },
        horsepower: { type: Number, required: false },
        fuel: { type: String, required: false },
        lengthInFeet: { type: Number, required: true }, //required
        depthInCM: { type: Number, required: false },
        weightInKg: { type: Number, required: false },
        boatConstructionMeterial: { type: String, required: false },
        color: { type: String, required: false },
        numberOfSeats: { type: Number, required: false },
        lysNumber: { type: String, required: false },
        equipment: { type: String, required: false },
        adHeadline: { type: String, required: true }, //required
        video: { type: String },
        phoneNumber: { type: String, required: false },
        address: { type: String, required: false },

    }
);

export const Boat: Model<IBoat> = Products.discriminator<IBoat>('boats', BoatSchema);

// export const Boat = model<IBoat, boatModel>('boats', BoatSchema);