import { Schema} from 'mongoose';
import { IPropertySell } from './property.interface';
import { Products } from '../../products/products.model';

const PropertySellSchema = new Schema<IPropertySell>(
    {
        propertyType: { type: String, required: true },
        address: { type: String },
        accessDescription: String,
        locationDescription: String,
        neighborhoodName: String,
        ownershipType: String,
        municipalitystring: String,
        usagestring: String,
        sectionstring: String,
        apartmentstring: String,

        internalUsableArea: String,
        externalUsableArea: String,
        balconyArea: String,
        primaryRoomsArea: String,
        groundArea: String,
        areaDescription: String,
        yearBuilt: String,
        yearRenovated: String,
        energyRating: String,
        heatingRating: String,
        bedrooms: { type: Number, required: true, default: 0 },
        totalRooms: { type: Number, default: 0 },
        floorLevel: String,
        facilities: [String],

        plotSize: String,
        leaseTerm: String,
        leaseFee: String,
        plotCharacteristics: String,

        sharedCost: String,
        sharedCostAfterInterest: String,
        sharedCostInclude: String,
        propertyTaxValue: String,
        listingPrice: String,
        additionalCost: String,
        additionalCostInclude: String,
        sharedDebt: String,

        appraisal_value: String,
        loan_value: String,
        sharedEquity: String,
        annualMunicipalFees: String,
        annualPropertyTax: String,

        additionalInformationOnSharedDebt: String,
        rightOfFirstRefusal: String,

        videoLink: String,
        virtualTourLink: String,

        viewingDate: String,
        timeFrom: String,
        timeTo: String,
        phoneNumber: String,
    }
);

export const PropertySellModel = Products.discriminator<IPropertySell>('properties_sell', PropertySellSchema);

