import { check } from "express-validator";

export const checkoutValidator = [
    check('package').trim().escape().not().isEmpty().withMessage('package is required').isMongoId().withMessage("Invalid package type")
]