import mongoose, { model, Model, Schema } from 'mongoose';
import { Icontact } from './contact.interface';

export interface contactModel extends Model<Icontact> { }

const ContactSchema: Schema<Icontact> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

export const Contact = model<Icontact, contactModel>('contacts', ContactSchema);
