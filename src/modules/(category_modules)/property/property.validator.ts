import { body } from "express-validator";

export const addPropertySellValidator = [
  body('title').trim().not().isEmpty().withMessage('title is required').isString(),
  body('price').trim().escape().not().isEmpty().withMessage('Price is required').isNumeric().withMessage("Invalid Price type"),
  body('sellingPrice').trim().escape().not().isEmpty().withMessage('sellingPrice is required').isNumeric().withMessage("Invalid Price type"),

  body('condition').trim().not().isEmpty().withMessage('condition is required').isString().isIn(["new", "used"]).withMessage("invalid condition"),
  body('details').trim().not().isEmpty().withMessage('details is required').isString(),

  body('lat').trim().escape().not().isEmpty().withMessage('lat is required').isNumeric().withMessage("Invalid lat type"),
  body('long').trim().escape().not().isEmpty().withMessage('long is required').isNumeric().withMessage("Invalid long type")
]

export const addPropertyRentValidator = [
  body('title').trim().not().isEmpty().withMessage('title is required').isString(),

  body('details').trim().not().isEmpty().withMessage('details is required').isString(),

  body('lat').trim().escape().not().isEmpty().withMessage('lat is required').isNumeric().withMessage("Invalid lat type"),
  body('long').trim().escape().not().isEmpty().withMessage('long is required').isNumeric().withMessage("Invalid long type")
]