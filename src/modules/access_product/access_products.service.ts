import AppError from "../../error/AppError";
import httpStatus from 'http-status'
import Access_Products from "./access_products.model";


const checkAccess = async (
    userId: string,
    category: "propertie_sell" | "propertie_rent" | "car" | "boat" | "motorcycle" | "bicycle" | "job" | "book" | "furniture" | "electronic" | "cloth" | "caravan" | "bobil"
): Promise<boolean> => {

    const access = await Access_Products.findOne({ user: userId, "purchasePackages.category": category });

    if (!access) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'You have not any boasting plan',
        );
    }

    const userAccess = access?.purchasePackages?.find(p => p?.category == category)!;

    if (userAccess?.expiredAt && (new Date(userAccess?.expiredAt) >= new Date())) {
        if (userAccess?.product_limit > userAccess?.added_product) {
            return true
        } else {
            throw new AppError(
                httpStatus.FORBIDDEN,
                'Your product add limit expired',
            );
        }
    } else {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'Your boasting plan expired',
        );
    }

}


export const access_productService = {
    checkAccess,
}