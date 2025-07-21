import AppError from "../../error/AppError";
import { Likes } from "./Like.model";
import { IStories } from "./stories.interface";
import { Reels } from "./stories.model";
import httpStatus from "http-status"
import { ObjectId } from "mongodb"


// GET /reels-with-stats/last-7-days
const allStories = async () => {

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const reels = await Reels.aggregate([
        {
            $match: {
                createdAt: { $gte: sevenDaysAgo }
            }
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'reel',
                as: 'reelLikes'
            }
        },
        {
            $project: {
                title: 1,
                videoUrl: 1,
                product: 1,
                createdAt: 1,
                user: 1,
                totalLikes: {
                    $size: {
                        $filter: {
                            input: "$reelLikes",
                            as: "like",
                            cond: { $eq: ["$$like.like", 1] }
                        }
                    }
                },
                totalUnlikes: {
                    $size: {
                        $filter: {
                            input: "$reelLikes",
                            as: "like",
                            cond: { $eq: ["$$like.unlike", 1] }
                        }
                    }
                }
            }
        },
        // {
        //     $lookup: {
        //         from: 'users',
        //         localField: 'user',
        //         foreignField: '_id',
        //         as: 'user'
        //     }
        // },
        {
            $lookup: {
                from: "users",
                let: { userId: "$user" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$userId"] }
                        }
                    },
                    {
                        $project: {
                            password: 0,
                            email: 0,
                            fcmToken: 0
                        }
                    }
                ],
                as: "user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'product'
            }
        },
        {
            $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true
            }
        },
        { $sort: { createdAt: -1 } },
    ]);

    return reels;
};

const addStorie = async (payload: IStories, video: string, user: string) => {
    const res = await Reels.create({ ...payload, videoUrl: video, user: new ObjectId(user) })
    return res;
}

const addLikeToStorie = async (reelId: string, userId: string, action: 'like' | 'unlike') => {
    const likeDoc = await Likes.findOne({ user: userId, reel: reelId });

    if (likeDoc) {
        if (likeDoc.like == 1 && action == "like") {
            throw new AppError(
                httpStatus.CONFLICT,
                'You already liked in this reels',
            );
        } else if (likeDoc.unlike == 1 && action == "unlike") {
            throw new AppError(
                httpStatus.CONFLICT,
                'You already Unlike in this reels',
            );
        }
    }

    if (likeDoc) {
        // Update existing
        if (action === 'like') {
            likeDoc.like = 1;
            likeDoc.unlike = 0;
        } else {
            likeDoc.like = 0;
            likeDoc.unlike = 1;
        }
        await likeDoc.save();
    } else {
        // Create new
        await Likes.create({
            user: userId,
            reel: reelId,
            like: action === 'like' ? 1 : 0,
            unlike: action === 'unlike' ? 1 : 0,
        });
    }
}


export const storiesService = {
    allStories,
    addStorie,
    addLikeToStorie
}