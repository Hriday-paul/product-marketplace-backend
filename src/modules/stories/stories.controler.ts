import { Request, RequestHandler } from "express";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { storiesService } from "./stories.service";
import httpStatus from "http-status";
import { uploadToS3 } from "../../utils/s3";

const allStories = catchAsync(async (req, res) => {
    const result = await storiesService.allStories()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Reels retrived successfully',
        data: result,
    });
})

const addStorie = catchAsync(async (req, res) => {

    let video;
    // video = req.file?.filename && (config.BASE_URL + '/videos/' + req.file.filename);

    if (req.file) {
        video = await uploadToS3({
            file: req.file,
            fileName: `videos/reels/${Math.floor(100000 + Math.random() * 900000)}`,
        });
    }

    const result = await storiesService.addStorie(req.body, video || "", req?.user?._id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'New Reels Create successfully',
        data: result,
    });
})

const addLikeToStorie: RequestHandler<{ id: string }, {}, { action: "like" | "unlike" }> = catchAsync(async (req, res) => {

    const result = await storiesService.addLikeToStorie(req.params.id, req?.user?._id, req.body.action);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `${req.body.action} to reels successfully`,
        data: result,
    });
})

export const StoriesControler = {
    allStories,
    addStorie,
    addLikeToStorie
}