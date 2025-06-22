import { body } from "express-validator";

export const addStorieValidator = [
  body('title').trim().not().isEmpty().withMessage('title is required').isString(),
  body('product').trim().optional().isMongoId().withMessage("Invalid product id"),
]

export const addLikeValidator = [
  body('action').trim().not().isEmpty().withMessage('action is required').isIn(["like", "unlike"]).withMessage("action type is invalid"),
]