import { Schema} from 'mongoose';
import { Products } from '../../products/products.model';
import { IPropertyRent } from './property.interface';

const PropertyRentSchema = new Schema<IPropertyRent>({
    property: { type: String },
    address: { type: String, },
    propertyType: { type: String },
    primaryRoomsArea: { type: String },
    internalUsableArea: { type: String },
    externalUsableArea: { type: String },
    terraceAndBalconyArea: { type: String },
    numberOfBedrooms: { type: Number, required: true, default: 0 },
    furnishing: { type: String },
    monthlyRent: { type: Number, required: true, default: 0 },
    deposit: { type: Number, required: true, default: 0 },
    includedInRent: { type: String },
    rentalPeriodStartDate: { type: Date },
    rentalPeriodEndDate: { type: Date },

    viewingDate: { type: Date },
    fromTime: { type: String },
    toTime: { type: String },
    phoneNumber: { type: String },
})

export const PropertyRentModel = Products.discriminator<IPropertyRent>('properties_rent', PropertyRentSchema);