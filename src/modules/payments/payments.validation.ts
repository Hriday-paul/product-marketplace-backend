import { check } from "express-validator";

export const checkoutValidator = [
    check('package').trim().not().isEmpty().withMessage('package is required').isMongoId().withMessage("Invalid package"),
    check('productId').trim().not().isEmpty().withMessage('productId is required').isMongoId().withMessage("Invalid productId")
]