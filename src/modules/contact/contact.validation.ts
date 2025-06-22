import { check } from "express-validator";

export const createContactValidator = [
  check('firstName').trim().escape().not().isEmpty().withMessage('firstName is required').isString(),
  check('lastName').trim().optional(),
  check('contact').optional().trim().isMobilePhone('any').withMessage('Invalid phone number'),
  check('email').trim().escape().not().isEmpty().withMessage('Email is required').isEmail().normalizeEmail({ all_lowercase: true }).withMessage('Invalid Email'),
  check('description').trim().escape().not().isEmpty().withMessage('description is required').isString(),
]

