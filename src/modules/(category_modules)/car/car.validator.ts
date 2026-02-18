
import { body } from "express-validator";

export const addCarValidator = [
    body('title').trim().not().isEmpty().withMessage('title is required').isString(),
    body('price').trim().escape().not().isEmpty().withMessage('Price is required').isNumeric().withMessage("Invalid Price type"),

    // body('category').trim().not().isEmpty().withMessage('category is required').isString().isIn(["propertie", "car", "boat", "motorcycle", "bicycle", "job", "book", "furniture", "electronic", "cloth"]).withMessage("invalid category"),
    body('condition').trim().not().isEmpty().withMessage('condition is required').isString().isIn(["new", "used"]).withMessage("invalid condition"),

    body('lat').trim().escape().not().isEmpty().withMessage('lat is required').isNumeric().withMessage("Invalid lat type"),
    body('long').trim().escape().not().isEmpty().withMessage('long is required').isNumeric().withMessage("Invalid long type"),

    body('reRegistrationFeeNOK').trim().not().isEmpty().withMessage('reRegistrationFeeNOK is required').isNumeric().withMessage("reRegistrationFeeInNOK should numeric type"),
    body('sellingPriceNOK').trim().not().isEmpty().withMessage('sellingPriceNOK is required').isNumeric().withMessage("reRegistrationFeeInNOK should numeric type"),

    body('address').trim().not().isEmpty().withMessage('address is required').isString(),
]


export const addCaravanValidator = [
    body('title').trim().not().isEmpty().withMessage('title is required').isString(),
    body('price').trim().escape().not().isEmpty().withMessage('Price is required').isNumeric().withMessage("Invalid Price type"),

    body('details').trim().not().isEmpty().withMessage('details is required').isString(),

    // body('category').trim().not().isEmpty().withMessage('category is required').isString().isIn(["propertie", "car", "boat", "motorcycle", "bicycle", "job", "book", "furniture", "electronic", "cloth"]).withMessage("invalid category"),
    body('condition').trim().not().isEmpty().withMessage('condition is required').isString().isIn(["new", "used"]).withMessage("invalid condition"),

    body('lat').trim().escape().not().isEmpty().withMessage('lat is required').isNumeric().withMessage("Invalid lat type"),
    body('long').trim().escape().not().isEmpty().withMessage('long is required').isNumeric().withMessage("Invalid long type"),

    body('reRegistrationFeeNOK').trim().not().isEmpty().withMessage('reRegistrationFeeNOK is required').isNumeric().withMessage("reRegistrationFeeInNOK should numeric type"),
    body('sellingPriceNOK').trim().not().isEmpty().withMessage('sellingPriceNOK is required').isNumeric().withMessage("reRegistrationFeeInNOK should numeric type"),

    body('address').trim().not().isEmpty().withMessage('address is required').isString(),
]