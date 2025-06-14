import { body } from "express-validator";

export const addOthersProductsValidator = [
  body('title').trim().not().isEmpty().withMessage('title is required').isString(),
  body('price').trim().escape().not().isEmpty().withMessage('Price is required').isNumeric().withMessage("Invalid Price type"),
  body('sellingPrice').trim().escape().not().isEmpty().withMessage('sellingPrice is required').isNumeric().withMessage("Invalid Price type"),
  body('stock').trim().escape().not().isEmpty().withMessage('stock is required').isNumeric().withMessage("Invalid Stock type"),
  
  body('category').trim().not().isEmpty().withMessage('category is required').isString().isIn(["bicycle", "book", "furniture", "electronic", "cloth"]).withMessage("invalid category"),

  body('condition').trim().not().isEmpty().withMessage('condition is required').isString().isIn(["new", "used"]).withMessage("invalid condition"),
  body('details').trim().not().isEmpty().withMessage('details is required').isString(),

  body('lat').trim().escape().not().isEmpty().withMessage('lat is required').isNumeric().withMessage("Invalid lat type"),
  body('long').trim().escape().not().isEmpty().withMessage('long is required').isNumeric().withMessage("Invalid long type"),

  body('address').trim().not().isEmpty().withMessage('address is required').isString(),
]