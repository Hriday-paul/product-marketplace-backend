import { body } from "express-validator";

export const addBoatValidator = [
  body('title').trim().not().isEmpty().withMessage('title is required').isString(),
  body('price').trim().escape().not().isEmpty().withMessage('Price is required').isNumeric().withMessage("Invalid Price type"),
  body('sellingPrice').trim().escape().not().isEmpty().withMessage('sellingPrice is required').isNumeric().withMessage("Invalid Price type"),
  body('stock').trim().escape().not().isEmpty().withMessage('stock is required').isNumeric().withMessage("Invalid Stock type"),
  
  // body('category').trim().not().isEmpty().withMessage('category is required').isString().isIn(["propertie", "car", "boat", "motorcycle", "bicycle", "job", "book", "furniture", "electronic", "cloth"]).withMessage("invalid category"),
  body('condition').trim().not().isEmpty().withMessage('condition is required').isString().isIn(["new", "used"]).withMessage("invalid condition"),
  body('details').trim().not().isEmpty().withMessage('details is required').isString(),

  body('lat').trim().escape().not().isEmpty().withMessage('lat is required').isNumeric().withMessage("Invalid lat type"),
  body('long').trim().escape().not().isEmpty().withMessage('long is required').isNumeric().withMessage("Invalid long type"),

  body('typeOfBoat').trim().not().isEmpty().withMessage('Boat type is required').isString(),
  body('registrationNumber').trim().optional(),
  body('modelYear').trim().not().isEmpty().withMessage('modelYear is required').isNumeric().withMessage("modelYear should numeric type"),
  body('horsepower').trim().optional().isNumeric().withMessage("horsepower should numeric type"),
  body('hasMotor').trim().optional().isBoolean().withMessage("hasMotor should boolean"),
  body('lengthInFeet').trim().optional().isNumeric().withMessage("lengthInFeet should numeric type"),
  body('depthInCM').trim().optional().isNumeric().withMessage("depthInCM should numeric type"),
  body('weightInKg').trim().optional().isNumeric().withMessage("weightInKg should numeric type"),
  body('numberOfSeats').trim().optional().isNumeric().withMessage("numberOfSeats should numeric type"),
  body('lysNumber').trim().optional(),
  body('adHeadline').trim().not().isEmpty().withMessage("adHeadline is required").isString().withMessage("adHeadline should string type"),

  body('address').trim().not().isEmpty().withMessage('address is required').isString(),
]