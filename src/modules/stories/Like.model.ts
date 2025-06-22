import { model, Model, Schema } from 'mongoose';
import { ILike } from './stories.interface';

export interface likeModel extends Model<ILike> { }

const LikeSchema: Schema<ILike> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        reel: { type: Schema.Types.ObjectId, ref: 'reels', required: true },
        like: { type: Number, enum: [0, 1], default: 0 },
        unlike: { type: Number, enum: [0, 1], default: 0 },
    }, { timestamps: true });

// likeSchema.index({ user: 1, reel: 1 }, { unique: true }); // Prevent duplicate likes

export const Likes = model<ILike, likeModel>('likes', LikeSchema);
