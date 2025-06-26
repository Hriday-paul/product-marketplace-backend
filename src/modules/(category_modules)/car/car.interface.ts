
export interface ICar {
    // Basic Information
    carType?: string;
    // title: string;
    taxClass: string;
    registrationNumber?: string;
    chassisNumber?: string;
    modelYear: number;
    carBrand: string;
    carModel: string;
    modelSpecification?: string;

    // Location & Technical
    parkedLocation?: string;
    fuelType: string;
    engineTuned?: boolean;
    transmissionType: string;
    transmissionDesignation?: string;
    wheelDrive: string;
    wheelDriveDesignation?: string;



    // Physical Specifications
    bodyType: string;
    numberOfSeats: number;
    numberOfDoors?: number;

    trunkVolumeInLiters?: number;
    vehicleWeightKg?: number;
    trailerWeightKg?: number;
    mainColor: string;
    colorDescription?: string;
    interiorColor?: string;
    comfort: string[];
    safety: string[];
    enginePerformance: string[];
    technology: string[];
    exterior: string[];


    // Vehicle History & Condition
    mileage: number;
    hasDefects: boolean;
    hasMajorRepairs: boolean;

    firstRegistrationDate?: Date;
    lastEUApprovalDate?: Date;
    nextEUInspectionDeadline?: Date;

    // Legal & Financial
    warrantyType?: string;
    conditionReportProvider?: string;
    video?: string;
    description?: string;
    reRegistrationFeeNOK: number;
    exemptFromReRegistrationFee: boolean;
    sellingPriceNOK?: number;
    // totalPrice: number;

    // Contact Information
    hasLiens: boolean;
    phoneNumber?: string;
    address: string;
}

export interface ICaravan {
    carType?: string;
    saleType?: string;
    modelYear: number;
    brand?: string;
    parkedLocation?: string;
    numberOfSleepingPlaces?: number;

    weightKg: number;
    // totalWeightKg: number;
    totalLengthCm?: number;
    interiorLengthCm?: number;
    widthCm?: number;

    equipment: string[];

    mileage?: number;
    hasConditionReport: boolean;
    hasWarranty: boolean;

    video?: string;

    reRegistrationFeeNOK?: number;
    exemptFromReRegistrationFee: boolean;
    sellingPriceNOK: number;
    // totalPrice: number;

    phoneNumber?: string;
    address: string;
}

export interface IBobil {
    carType?: string;
    motorhomeType?: string;
    registrationNumber?: string;
    chassisNumber?: string;
    modelYear?: number;
    brand?: string;
    chassisType?: string;
    motorhomeParkedIn?: string;
    fuel?: string;

    // Technical Specifications
    cylinderCapacityLiters: number;
    horsepower: number;
    horsepowerRequired: number;

    gearbox?: string;
    wheelDrive: string;
    weightKg: number;

    lengthCm: number;
    widthCm?: number;
    registeredSeats: number;
    sleepingPlaces: number;
    bedType?: string;

    // Equipment
    equipment: string[];

    // Maintenance & Condition
    mileage?: number;

    warrantyType?: string;
    hasMotorhomeConditionReport: boolean;
    hasMotorhomeMaintenProg: boolean;

    video?: string

    reRegistrationFeeNOK?: number;
    exemptFromReRegistrationFee: boolean;
    sellingPriceNOK: number;
    // totalPrice: number;

    phoneNumber?: string;
    address: string;
}