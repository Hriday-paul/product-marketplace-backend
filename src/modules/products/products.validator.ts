import { check, query } from "express-validator";

export const addProductValidator = [
  check('name').trim().not().isEmpty().withMessage('name is required').isString(),
  check('price').trim().escape().not().isEmpty().withMessage('Price is required').isNumeric().withMessage("Invalid Price type"),
  check('stock').trim().escape().not().isEmpty().withMessage('stock is required').isNumeric().withMessage("Invalid Stock type"),
  // check('image').notEmpty().withMessage('Image is requires'),
  // check('category').trim().not().isEmpty().withMessage('category is required').isString(),
  check('details').trim().not().isEmpty().withMessage('details is required').isString(),
]

export const productQueryChecker = [
  query("category").trim().optional().isString().isIn(["propertie", "car", "boat", "motorcycle", "bicycle", "job", "book", "furniture", "electronic", "cloth"]).withMessage("invalid category"),
]