export interface IPropertySell {
    propertyType: string;
    address: string;
    accessDescription: string;
    locationDescription: string;
    neighborhoodName: string;
    ownershipType: string;
    municipalitystring: string;
    usagestring: string;
    sectionstring: string;
    apartmentstring: string;

    internalUsableArea: string;
    externalUsableArea: string;
    balconyArea: string;
    primaryRoomsArea: string;
    groundArea: string;
    areaDescription: string;
    yearBuilt: string;
    yearRenovated: string;
    energyRating: string;
    heatingRating: string;
    bedrooms: number;
    totalRooms: number;
    floorLevel: string;
    facilities: string[];



    plotSize: string,
    leaseTerm: string,
    leaseFee: string,
    plotCharacteristics: string,

    sharedCost: string,
    sharedCostAfterInterest: string,
    sharedCostInclude: string,
    propertyTaxValue: string,
    listingPrice: string,
    additionalCost: string,
    additionalCostInclude: string,
    sharedDebt: string,

    appraisal_value: string,
    loan_value: string,
    sharedEquity: string,
    annualMunicipalFees: string,
    annualPropertyTax: string,

    additionalInformationOnSharedDebt: string,
    rightOfFirstRefusal: string,

    videoLink: string,
    virtualTourLink: string,

    viewingDate: string,
    timeFrom: string,
    timeTo: string,
    phoneNumber: string
}

export interface IPropertyRent {
    property: string;
    address: string;
    propertyType: string;
    primaryRoomsArea: string;
    internalUsableArea: string;
    externalUsableArea: string;
    terraceAndBalconyArea: string;
    numberOfBedrooms: number;
    furnishing: string;
    monthlyRent: number;
    deposit: number;
    includedInRent: string;
    rentalPeriodStartDate: Date;
    rentalPeriodEndDate: Date;

    viewingDate: Date;
    fromTime: string;
    toTime: string;
    phoneNumber: string;
}