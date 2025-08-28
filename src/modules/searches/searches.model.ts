import { Schema, Types, model } from 'mongoose';
import { ISearches, ISearchesModel } from './searches.interface';

const searcheSchema = new Schema<ISearches>(
    {
        search: {
            type: String,
            default: null,
        },
        location: {
            type: { lat: Number, long: Number },
            default: null
        },
        category: {
            type: String,
        },
        condition: {
            type: String,
            default: null
        },
        price: {
            type: { max: Number, min: Number },
            default: null,
        },
        user: {
            type: Types.ObjectId,
            required: true,
            ref: 'users',
        }
    },
    {
        timestamps: true,
    },
);

const Search = model<ISearches, ISearchesModel>('searches', searcheSchema);

export default Search;
