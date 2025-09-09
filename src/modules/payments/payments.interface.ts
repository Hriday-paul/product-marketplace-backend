import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IPackage } from '../package/package.interface';



export interface IPayment {
  _id?: ObjectId;
  user: ObjectId | IUser;
  package: IPackage;
  total_amount: number;
  product_limit : number;
  tranId: string;
  isPaid: boolean;
  isDeleted: boolean;
  startedAt: Date
  expiredAt: Date
}

export type ISubscriptionsModel = Model<IPayment, Record<string, unknown>>;
