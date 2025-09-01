import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';

export interface ISearches {
    _id: ObjectId;
    search?: string;
    category?: string;
    // location?: { lat: number, long: number }
    location : {type : string, coordinates : number[]}
    price ?: { max: number, min: number };
    condition ?: string;
    user: IUser;
}

export type ISearchesModel = Model<ISearches, Record<string, unknown>>;
