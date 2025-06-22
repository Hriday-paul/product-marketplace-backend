import { model, Model, Schema } from 'mongoose';
import { IStories } from './stories.interface';


export interface reelModel extends Model<IStories> { }

const ReelSchema: Schema<IStories> = new Schema(
    {
        title: { type: String, required: true },
        videoUrl: { type: String, required: true },
        // view: { type: Number, default: 0 },
        product: { type: Schema.Types.ObjectId, ref: 'products'},
        user: { type: Schema.Types.ObjectId, ref: 'users', required: true }

    },
    { timestamps: true },
);

export const Reels = model<IStories, reelModel>('reels', ReelSchema);