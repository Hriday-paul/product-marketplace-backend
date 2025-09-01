import { Schema, Types, model } from 'mongoose';
import { ISearches, ISearchesModel } from './searches.interface';

const searcheSchema = new Schema<ISearches>(
    {
        search: {
            type: String,
            default: null,
        },
        // location: {
        //     type: { lat: Number, long: Number },
        //     default: null
        // },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                // required: true,
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                // required: true,
            },
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

searcheSchema.index({ location: '2dsphere' });

const Search = model<ISearches, ISearchesModel>('searches', searcheSchema);

export default Search;
