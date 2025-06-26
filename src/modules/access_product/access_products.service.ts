import AppError from "../../error/AppError";
import httpStatus from 'http-status'
import Access_Products from "./access_products.model";


const checkAccess = async (
    userId: string
): Promise<boolean> => {

    const userAccess = await Access_Products.findOne({ user: userId });

    if (!userAccess) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'You have not any boasting plan',
        );
    }

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