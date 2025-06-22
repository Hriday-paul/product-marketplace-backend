import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { IUser } from "./user.interface";
import { IstoreProfile, User } from "./user.models";
import httpStatus from 'http-status'

// update user profile
const updateProfile = async (payload: IUser, userId: string, image: string) => {

    const { contact, first_name, last_name, address, bio, date_of_birth, lat, long, notification } = payload

    const updateFields: Partial<IUser> = { contact, first_name, last_name, address, bio, date_of_birth, lat, long, notification };

    if (image) updateFields.image = image;

    // Remove undefined or null fields to prevent overwriting existing values with null
    Object.keys(updateFields).forEach((key) => {
        if (updateFields[key as keyof IUser] === undefined || updateFields[key as keyof IUser] === '' || updateFields[key as keyof IUser] === null) {
            delete updateFields[key as keyof IUser];
        }
    });

    // check updated field found or not
    if (Object.keys(updateFields).length === 0) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'No valid field found',
        );
    }

    const result = await User.updateOne({ _id: userId }, updateFields)

    return result
}

// create store profile as a user
const createStoreProfile = async (payload: IstoreProfile, userId: string, image: string, banner: string) => {
    const { address = "", bio = "", email, name, contact = "" } = payload;

    const result = await User.updateOne({ _id: userId }, { store_profile: { address, banner, bio, email, name, contact, image } })

    return result
}

// update store profile
const updateStoreProfile = async (payload: IstoreProfile, userId: string, image: string | undefined, banner: string | undefined) => {
    const { address, bio, name, contact } = payload;

    const updateFields: Partial<IstoreProfile> = { contact, address, bio, name };


    if (image) updateFields.image = image;
    if (banner) updateFields.banner = banner;

    // Remove undefined or null fields to prevent overwriting existing values with null
    Object.keys(updateFields).forEach((key) => {
        if (updateFields[key as keyof IstoreProfile] === undefined || updateFields[key as keyof IstoreProfile] === '' || updateFields[key as keyof IstoreProfile] === null) {
            delete updateFields[key as keyof IstoreProfile];
        }
    });

    // check updated field found or not
    if (Object.keys(updateFields).length === 0) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'No valid field found',
        );
    }

    const updateQuery: Record<string, any> = {};

    for (const [key, value] of Object.entries(updateFields)) {
        updateQuery[`store_profile.${key}`] = value;
    }

    const result = await User.updateOne({ _id: userId }, { $set: updateQuery })

    return result
}


//get all users
const allUsers = async (query: Record<string, any>) => {
    const userModel = new QueryBuilder(User.find({ role: { $ne: "admin" } }, { password: 0 }), query)
        .search(['name', 'email', 'contact'])
        .filter()
        .paginate()
        .sort();
    const data: any = await userModel.modelQuery;
    const meta = await userModel.countTotal();
    return {
        data,
        meta,
    };
}


const getUserById = async (id: string) => {
    const result = await User.findById(id, { password: 0, verification: 0 });
    return result;
};

//user status update
const status_update_user = async (payload: { status: boolean }, id: string) => {

    const result = await User.updateOne({ _id: id }, { status: payload?.status })

    return result
}

const deletemyAccount = async (userId: string) => {

    const res = await User.updateOne({ _id: userId }, { isDeleted: true });

    return res;
}

export const userService = {
    updateProfile,
    createStoreProfile,
    updateStoreProfile,
    getUserById,
    allUsers,
    status_update_user,
    deletemyAccount
}