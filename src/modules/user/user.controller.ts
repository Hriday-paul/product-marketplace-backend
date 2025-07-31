import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userService } from "./user.service";
import { IUser } from "./user.interface";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status'
import { IstoreProfile } from "./user.models";
import config from "../../config";
import { uploadToS3 } from "../../utils/s3";

//get all users
const all_users = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await userService.allUsers(query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrive successfully',
        data: result,
    });
})

const updateProfile = catchAsync(async (req: Request<{}, {}, IUser>, res: Response) => {

    let image;
    // image = req.file?.filename && (config.BASE_URL + '/images/' + req.file.filename);

    if (req.file) {
        image = await uploadToS3({
            file: req.file,
            fileName: `images/user/${Math.floor(100000 + Math.random() * 900000)}`,
        });
    }

    const result = await userService.updateProfile(req.body, req.user._id, image || "")

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'profile updated successfully',
        data: result,
    });
})

// ---------------create store profile------------
const createStoreProfile = catchAsync(async (req: Request<{}, {}, IstoreProfile>, res: Response) => {

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let image, banner;

    // image = files?.image?.[0]?.filename && (config.BASE_URL + '/images/' + files.image[0].filename)

    // banner = files?.banner?.[0]?.filename && (config.BASE_URL + '/images/' + files.banner[0].filename);


    if (files) {
        //banners
        if (files?.banner?.length) {
            banner = (await uploadToS3({
                file: files?.banner[0],
                fileName: `images/user/banner/${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`,
            })) as string;
        }

        if (files?.image?.length) {
            image = (await uploadToS3({
                file: files?.image[0],
                fileName: `images/user/${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`,
            })) as string;
        }
    }

    const result = await userService.createStoreProfile(req.body, req.user._id, image || "", banner || "")

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'store profile created successfully',
        data: result,
    });

})

// ---------------update store profile------------
const updateStoreProfile = catchAsync(async (req: Request<{}, {}, IstoreProfile>, res: Response) => {

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let image, banner;
    image = files?.image?.[0]?.filename && config.BASE_URL + '/images/' + files.image[0].filename

    banner = files?.banner?.[0]?.filename && config.BASE_URL + '/images/' + files.banner[0].filename

    if (files) {
        //banners
        if (files?.banner?.length) {
            banner = (await uploadToS3({
                file: files?.banner[0],
                fileName: `images/user/banner/${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`,
            })) as string;
        }

        if (files?.image?.length) {
            image = (await uploadToS3({
                file: files?.image[0],
                fileName: `images/user/${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`,
            })) as string;
        }
    }

    const result = await userService.updateStoreProfile(req.body, req.user._id, image, banner)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'store profile updated successfully',
        data: result,
    });

})

//get my profile
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getUserById(req?.user?._id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'profile fetched successfully',
        data: result,
    });
});

// status update user
const update_user_status: RequestHandler<{ id: string }, {}, { status: boolean }> = catchAsync(async (req, res) => {
    const result = await userService.status_update_user(req.body, req.params.id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'status updated successfully',
        data: result,
    });
})

// delete my accont
const deletemyAccount = catchAsync(async (req, res) => {

    const result = await userService.deletemyAccount(req.user._id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Your account deleted successfully',
        data: result,
    });
})

const deleteUser = catchAsync(async (req, res) => {

    const result = await userService.deletemyAccount(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User account deleted successfully',
        data: result,
    });
})

const userDetails = catchAsync(async (req, res) => {

    const result = await userService.userDetails(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User details retrived successfully',
        data: result,
    });
})


export const userController = {
    updateProfile,
    createStoreProfile,
    updateStoreProfile,
    getMyProfile,
    update_user_status,
    all_users,
    deletemyAccount,
    deleteUser,
    userDetails
}