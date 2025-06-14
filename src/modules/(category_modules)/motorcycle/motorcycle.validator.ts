import { body } from "express-validator";

export const addMotorcycleValidator = [
  body('title').trim().not().isEmpty().withMessage('title is required').isString(),
  body('price').trim().escape().not().isEmpty().withMessage('Price is required').isNumeric().withMessage("Invalid Price type"),
  body('sellingPrice').trim().escape().not().isEmpty().withMessage('sellingPrice is required').isNumeric().withMessage("Invalid Price type"),
  body('stock').trim().escape().not().isEmpty().withMessage('stock is required').isNumeric().withMessage("Invalid Stock type"),

  // body('category').trim().not().isEmpty().withMessage('category is required').isString().isIn(["propertie", "car", "boat", "motorcycle", "bicycle", "job", "book", "furniture", "electronic", "cloth"]).withMessage("invalid category"),
  body('condition').trim().not().isEmpty().withMessage('condition is required').isString().isIn(["new", "used"]).withMessage("invalid condition"),
  body('details').trim().not().isEmpty().withMessage('details is required').isString(),

  body('lat').trim().escape().not().isEmpty().withMessage('lat is required').isNumeric().withMessage("Invalid lat type"),
  body('long').trim().escape().not().isEmpty().withMessage('long is required').isNumeric().withMessage("Invalid long type"),

  body('motorcycleType').trim().not().isEmpty().withMessage('motorcycleType is required').isString(),
  body('horsepower').trim().optional().isNumeric().withMessage("horsepower should numeric type"),
  body('modelYear').trim().optional().isNumeric().withMessage("modelYear should numeric type"),
  body('displacementCCM').trim().optional().isNumeric().withMessage("displacementCCM should numeric type"),
  body('weightKg').trim().optional().isNumeric().withMessage("weightKg should numeric type"),
  body('mileage').trim().optional().isNumeric().withMessage("mileage should numeric type"),
  body('numberOfOwners').trim().optional().isNumeric().withMessage("numberOfOwners should numeric type"),
  body('hasConditionReport').trim().optional().isBoolean().withMessage("hasConditionReport should boolean type"),
  body('hasMaintenance').trim().optional().isBoolean().withMessage("hasMaintenance should boolean type"),

  body('reRegistrationFeeInNOK').trim().optional().isNumeric().withMessage("reRegistrationFeeInNOK should numeric type"),

  body('exemptFromReRegistrationFee').trim().optional().isBoolean().withMessage("exemptFromReRegistrationFee should boolean type"),

  body('address').trim().not().isEmpty().withMessage('address is required').isString(),
]