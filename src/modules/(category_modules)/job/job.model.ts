import { model, Model, Schema } from 'mongoose';
import { IJob } from './job.interface';
import { Products } from '../../products/products.model';


export interface jobModel extends Model<IJob> { }

const JobSchema: Schema<IJob> = new Schema(
    {
        headline: { type: String, required: true },
        numberOfPositions: { type: Number, required: true },
        employmentType: { type: String, required: true },
        sector: { type: String, required: true },
        industry: { type: String, required: true },
        jobFunction: { type: String },
        keywords: [{ type: String }],
        workingLanguage: { type: String },
        salaryDescription: { type: String },
        additionalInformation: { type: String },
        companyInformation: { type: String },
        website: { type: String },
        address: { type: String, required: true },
        contactPerson: { type: String },
        contactPersonJobTitle: { type: String },
        contactPersonPhoneNumber: { type: String },
        contactPersonEmail: { type: String },
    }
);

export const Job: Model<IJob> = Products.discriminator<IJob>('jobs', JobSchema);
// export const Job = model<IJob, jobModel>('jobs', JobSchema);