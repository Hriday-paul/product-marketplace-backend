import { ObjectId } from "mongoose"

export interface IStories {
    title : string,
    videoUrl : string,
    // view : number,
    product ?: ObjectId,
    user : ObjectId
}

export interface ILike {
    user : ObjectId,
    reel : ObjectId,
    like : number,
    unlike : number
}
