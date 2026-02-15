import { check, query } from "express-validator";

export const addPackageValidator = [
    check('title').trim().not().isEmpty().withMessage('title is required').isString().isLength({ min: 2 }).withMessage('title min length is 2'),
   
    check('price').trim().escape().not().isEmpty().withMessage('price is required').isNumeric().withMessage('invalid price format'),

    check("type").trim().not().isEmpty().isString().isIn(["basic", "premium"]).withMessage("invalid package type"),

    check("category").trim().not().isEmpty().isString().isIn(["propertie_sell", "propertie_rent", "car", "boat", "motorcycle", "bicycle", "job", "book", "furniture", "electronic", "cloth", "caravan", "bobil"]).withMessage("invalid category"),
]

export const updatePackageValidator = [
    check('product_limit').trim().optional().isFloat().withMessage('invalid product_limit format'),
    check('duration_day').trim().optional().isFloat().withMessage('invalid duration format'),
    check('price').trim().optional().isNumeric().withMessage('invalid price format'),
]