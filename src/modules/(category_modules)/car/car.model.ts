import { Schema, model, Document } from 'mongoose';
import { IBobil, ICar, ICaravan } from './car.interface';
import { Products } from '../../products/products.model';

const CarSchema = new Schema<ICar>(
  {
    // Basic Information
    carType: { type: String },
    // title: { type: String, required: true },
    taxClass: { type: String, required: true },
    registrationNumber: { type: String },
    chassisNumber: { type: String },
    modelYear: { type: Number, default: 0, required: true },
    carBrand: { type: String, required: true },
    carModel: { type: String, required: true },
    modelSpecification: { type: String },

    // Location & Technical
    parkedLocation: { type: String },
    fuelType: { type: String, required: true },
    engineTuned: { type: Boolean, default: false },
    transmissionType: { type: String, required: true },
    transmissionDesignation: { type: String },
    wheelDrive: { type: String, required: true },
    wheelDriveDesignation: { type: String },

    // Physical Specs
    bodyType: { type: String, required: true },
    numberOfSeats: { type: Number, default: 0, required: true },
    numberOfDoors: { type: Number, default: 0 },

    trunkVolumeInLiters: { type: Number, default: 0 },
    vehicleWeightKg: { type: Number, default: 0 },
    trailerWeightKg: { type: Number, default: 0 },
    mainColor: { type: String, required: true },
    colorDescription: { type: String },
    interiorColor: { type: String },

    comfort: { type: [String], default: [] },
    safety: { type: [String], default: [] },
    enginePerformance: { type: [String], default: [] },
    technology: { type: [String], default: [] },
    exterior: { type: [String], default: [] },

    // Vehicle History
    mileage: { type: Number, default: 0, required: true },
    hasDefects: { type: Boolean, default: false },
    hasMajorRepairs: { type: Boolean, default: false },

    firstRegistrationDate: { type: Date },
    lastEUApprovalDate: { type: Date },
    nextEUInspectionDeadline: { type: Date },

    // Legal & Finance
    warrantyType: { type: String },
    conditionReportProvider: { type: String },
    video: { type: String },
    description: { type: String },
    reRegistrationFeeNOK: { type: Number, default: 0, required: true },
    exemptFromReRegistrationFee: { type: Boolean, default: false },
    sellingPriceNOK: { type: Number, default: 0 },
    // totalPrice: { type: Number, default: 0, required: true },

    // Contact
    hasLiens: { type: Boolean, default: false },
    phoneNumber: { type: String },
    address: { type: String, required: true }
  }
);

export const CarModel = Products.discriminator<ICar>('cars', CarSchema);



const CaravanSchema = new Schema<ICaravan>(
  {
    carType: { type: String },
    saleType: { type: String },
    modelYear: { type: Number, default: 0, required: true },
    brand: { type: String },
    parkedLocation: { type: String },
    numberOfSleepingPlaces: { type: Number, default: 0 },

    weightKg: { type: Number, default: 0, required: true },
    totalLengthCm: { type: Number, default: 0 },
    interiorLengthCm: { type: Number, default: 0 },
    widthCm: { type: Number, default: 0 },

    equipment: { type: [String], default: [] },
   
    mileage: { type: Number, default: 0 },

    hasConditionReport: { type: Boolean, default: false },
    hasWarranty: { type: Boolean, default: false },

    video: { type: String },

    reRegistrationFeeNOK: { type: Number, default: 0 },
    exemptFromReRegistrationFee: { type: Boolean, default: false },
    sellingPriceNOK: { type: Number, default: 0, required: true },

    phoneNumber: { type: String },
    address: { type: String, required: true }
  }
);

export const Caravan = Products.discriminator<ICaravan>('caravans', CaravanSchema);



const BobilSchema = new Schema<IBobil>(
  {
    carType: { type: String },
    motorhomeType: { type: String },
    registrationNumber: { type: String },
    chassisNumber: { type: String },
    modelYear: { type: Number, default: 0 },
    brand: { type: String },
    chassisType: { type: String },
    motorhomeParkedIn: { type: String },
    fuel: { type: String },

    cylinderCapacityLiters: { type: Number, default: 0 },
    horsepower: { type: Number, default: 0 },
    horsepowerRequired: { type: Number, default: 0 },

    gearbox: { type: String },
    wheelDrive: { type: String, required: true },
    weightKg: { type: Number, default: 0 },

    lengthCm: { type: Number, default: 0 },
    widthCm: { type: Number, default: 0 },
    registeredSeats: { type: Number, default: 0 },
    sleepingPlaces: { type: Number, default: 0 },
    bedType: { type: String },

    equipment: { type: [String], default: [] },

    mileage: { type: Number, default: 0 },

    warrantyType: { type: String },
    hasMotorhomeConditionReport: { type: Boolean, default: false },
    hasMotorhomeMaintenProg: { type: Boolean, default: false },

    video: { type: String },

    reRegistrationFeeNOK: { type: Number, default: 0 },
    exemptFromReRegistrationFee: { type: Boolean, default: false },
    sellingPriceNOK: { type: Number, default: 0 },

    phoneNumber: { type: String },
    address: { type: String, required: true }
  }
);
export const Bobil = Products.discriminator<IBobil>('bobils', BobilSchema);