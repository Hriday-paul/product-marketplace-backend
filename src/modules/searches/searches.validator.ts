
import { check } from "express-validator";

export const addSearchValidator = [
        
    check('category')
        .optional()
        .isString().withMessage('each category must be a string')
        .isIn(["propertie", "car", "boat", "motorcycle", "bicycle", "job", "book", "furniture", "electronic", "cloth", "caravan", "bobil"])
        .withMessage('invalid category'),


    check('condition').trim().optional().isString().isIn(["new", "used"]).withMessage("invalid condition"),

    check("price").optional().isObject().withMessage("price must be an object"),
    check("price.max")
        .optional()
        .isNumeric()
        .withMessage("max must be a number"),
    check("location.min")
        .optional()
        .isNumeric()
        .withMessage("min must be a number"),

    check("location").optional().isObject().withMessage("location must be an object"),

    check("location.lat")
        .optional()
        .isNumeric()
        .withMessage("lat must be a number"),
    check("location.long")
        .optional()
        .isNumeric()
        .withMessage("long must be a number"),

]