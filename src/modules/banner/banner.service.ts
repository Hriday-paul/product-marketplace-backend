import AppError from "../../error/AppError";
import { Banners } from "./banner.model";
import httpStatus from 'http-status';

const banners = async () => {

    const res = await Banners.find();

    return res;
}

const uploadBanner = async (image: string) => {
    const res = await Banners.create({ image })
    return res;
}

const deleteBanner = async (bannerId: string) => {

    const res = await Banners.deleteOne({ _id: bannerId })

    if (res.deletedCount <= 0) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Banner not found',
        );
    }

    return res;
}

export const bannerService = {
    banners,
    uploadBanner,
    deleteBanner,
}