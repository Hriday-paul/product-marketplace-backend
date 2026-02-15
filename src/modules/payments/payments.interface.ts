import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IPackage } from '../package/package.interface';
import { IProduct } from '../products/products.interface';



export interface IPayment {
  _id?: ObjectId;
  user: ObjectId | IUser;
  package: IPackage;
  product : IProduct
  total_amount: number;
  tranId: string;
  isPaid: boolean;
  isDeleted: boolean;
  startedAt: Date
  expiredAt: Date
}

export type ISubscriptionsModel = Model<IPayment, Record<string, unknown>>;
