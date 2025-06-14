
export interface IJob {
  headline: string;
  numberOfPositions: number;
  employmentType: string;
  sector: string;
  industry: string;
  jobFunction?: string;
  keywords?: string[];
  workingLanguage?: string;
  salaryDescription?: string;
  additionalInformation?: string;
  companyInformation?: string;
  website?: string;
  address: string;
  contactPerson?: string;
  contactPersonJobTitle?: string;
  contactPersonPhoneNumber?: string;
  contactPersonEmail?: string;
}