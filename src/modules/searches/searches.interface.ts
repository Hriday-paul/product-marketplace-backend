import { Model, ObjectId } from 'mongoose';

export interface ISearches {
    _id?: ObjectId;
    search?: string;
    category?: string;
    location?: { lat: number, long: number }
    price: { max: number, min: number };
    condition: string;
    user: ObjectId;
}

export type ISearchesModel = Model<ISearches, Record<string, unknown>>;
