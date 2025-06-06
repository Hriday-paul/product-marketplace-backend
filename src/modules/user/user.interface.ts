import { Types } from 'mongoose';
import { IstoreProfile } from './user.models';

export interface IUser {
  _id: Types.ObjectId;
  status: number; // 1 or 0
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  password: string;
  image: string;
  isverified: boolean
  role: "user" | "admin";
  verification: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
  isDeleted: boolean,
  address: string,
  date_of_birth: string,
  bio: string,
  lat : number,
  long : number,
  store_profile: IstoreProfile
}

