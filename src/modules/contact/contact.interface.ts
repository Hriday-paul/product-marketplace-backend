import mongoose, { ObjectId } from 'mongoose';

export interface Icontact {
  firstName: string;
  lastName: string;
  email: string;
  contact : string;
  description: string;
}
