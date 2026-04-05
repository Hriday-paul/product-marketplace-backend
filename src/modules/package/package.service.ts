import AppError from "../../error/AppError";
import { IPackage } from "./package.interface"
import Package from "./package.model";
import httpStatus from 'http-status';

export const listingPackageFeatures = {
    basic: [
        "Standard listing visibility",
        "Appears in search results",
        "Normal ranking position",
        'No visual highlight'
    ],

    premium: [
        "Higher search ranking",
        "Top placement in category for 7 days",
        "Highlighted listing badge",
        "Priority customer support",
    ],
};

//create a new package
const create_Package = async (payload: IPackage) => {
    const features = listingPackageFeatures[payload?.type];
    payload.features = features;

    //check doublicate package in same type
    const exist = await Package.findOne({ category: payload?.category, type: payload?.type, isDeleted: false });

    if (exist) {
        throw new AppError(httpStatus.CONFLICT, "Package already exist in this category")
    }

    const packages = await Package.create(payload);
    if (!packages) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to create packages',
        );
    }
    return packages;
}

const update_Package = async (payload: IPackage, id: string) => {

    const exist = await Package.findById(id);

    if (!exist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Package does not exist',
        );
    }

    //check doublicate package in same type
    const exist_pack = await Package.findOne({ _id: { $ne: id }, category: payload?.category, type: payload?.type, isDeleted: false });

    if (exist_pack) {
        throw new AppError(httpStatus.CONFLICT, "Package already exist in this category")
    }

    const packages = await Package.updateOne({ _id: id }, { ...payload });
    return packages;
}

const delete_Package = async (id: string) => {
    const exist = await Package.findById(id);

    if (!exist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Package not found',
        );
    }
    const packages = await Package.updateOne({ _id: id }, { isDeleted: true });
    return packages;
}

// get all packeges and filter by plan type
const getPackages_by_type = async (category?: string) => {
    const query = category ? { isDeleted: false, category } : { isDeleted: false };

    const packages = await Package.find(query).sort({ type: 1 });
    return packages;
}

// get packeges details
const getPackages_details = async (id: string) => {
    const packages = await Package.findOne({ _id: id, isDeleted: false });
    return packages;
}

export const packageService = {
    create_Package,
    getPackages_by_type,
    update_Package,
    delete_Package,
    getPackages_details
}