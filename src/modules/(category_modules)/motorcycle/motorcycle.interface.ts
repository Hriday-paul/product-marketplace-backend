
export interface IMotorcycle {
//   productImage: string;
//   category: string;
  registrationNumber: string;
  chassisNumber: string;
  brand: string;
  model: string;
  motorcycleType: string;
  modelYear: number;
  fuel: string;
  horsepower: number;
  displacementCCM: number;
  weightKg: number;
  color: string;

  equipment: string[];

  mileage: number;
  numberOfOwners: number;
  hasConditionReport: boolean;
  hasMaintenance: boolean;
  warrantyType: string;
  video?: string;

  reRegistrationFeeInNOK?: number;
  exemptFromReRegistrationFee: boolean;

    sellingPriceNOK : number

  phoneNumber: string;
  address: string;
}