import { body } from "express-validator";

export const addJobValidator = [
  body('title').trim().not().isEmpty().withMessage('title is required').isString(),

  // body('category').trim().not().isEmpty().withMessage('category is required').isString().isIn(["propertie", "car", "boat", "motorcycle", "bicycle", "job", "book", "furniture", "electronic", "cloth"]).withMessage("invalid category"),

  body('details').trim().not().isEmpty().withMessage('details is required').isString(),

  body('lat').trim().escape().not().isEmpty().withMessage('lat is required').isNumeric().withMessage("Invalid lat type"),
  body('long').trim().escape().not().isEmpty().withMessage('long is required').isNumeric().withMessage("Invalid long type"),




  body("headline")
    .trim()
    .notEmpty().withMessage("Headline is required")
    .isString().withMessage("Headline must be a string"),

  body("numberOfPositions")
    .notEmpty().withMessage("Number of Positions is required")
    .isInt({ min: 1 }).withMessage("Number of Positions must be a positive integer"),

  body("employmentType")
    .trim()
    .notEmpty().withMessage("Employment Type is required"),

  body("sector")
    .trim()
    .notEmpty().withMessage("Sector is required"),

  body("industry")
    .trim()
    .notEmpty().withMessage("Industry is required"),

  body("jobFunction")
    .optional()
    .isString().withMessage("Job Function must be a string"),

  body("keywords")
    .optional()
    .isArray().withMessage("Keywords must be an array of strings"),

  body("keywords.*")
    .optional()
    .isString().withMessage("Each keyword must be a string"),

  body("workingLanguage")
    .optional()
    .isString().withMessage("Working Language must be a string"),

  body("salaryDescription")
    .optional()
    .isString().withMessage("Salary Description must be a string"),

  body("additionalInformation")
    .optional()
    .isString().withMessage("Additional Information must be a string"),

  body("companyInformation")
    .optional()
    .isString().withMessage("Company Information must be a string"),

  body("website")
    .optional()
    .isURL().withMessage("Website must be a valid URL"),

  body("contactPerson")
    .optional()
    .isString().withMessage("Contact Person must be a string"),

  body("contactPersonJobTitle")
    .optional()
    .isString().withMessage("Job Title must be a string"),

  body("contactPersonPhoneNumber")
    .optional()
    .isMobilePhone('any').withMessage("Phone number must be valid"),

  body("contactPersonEmail")
    .optional()
    .isEmail().withMessage("Email must be valid"),


  body('address').trim()
    .notEmpty().withMessage("Address is required")
    .isString().withMessage("Address must be a string"),
]