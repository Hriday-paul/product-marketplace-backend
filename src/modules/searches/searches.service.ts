import { ISearches } from "./searches.interface";
import Search from "./searches.model";
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { Types } from "mongoose";

const addnewSearches = async (userId: string, payload: ISearches) => {
    const res = await Search.insertOne({ ...payload, user: userId });
    return res;
}

const mySearchHistory = async (userId: string) => {
    const res = await Search.find({ user: userId });
    return res;
}

const DeletemySearchHistory = async (searchId: string, userId: string) => {
    const exist = await Search.findOne({ _id: searchId });

    if (!exist) {
        throw new AppError(
            httpStatus.NOT_FOUND, "Search history not found"
        )
    }

    if (exist?.user?.toString() !== userId) {
        throw new AppError(
            httpStatus.FORBIDDEN, "You are not owner of this search"
        )
    }

    const res = await Search.deleteOne({ _id: searchId })
    return res;

}

export const searchServices = {
    addnewSearches,
    mySearchHistory,
    DeletemySearchHistory
}