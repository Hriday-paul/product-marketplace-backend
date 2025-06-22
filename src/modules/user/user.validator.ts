import { body, check, param } from "express-validator";

export const statusUpdateValidator = [
    check('status').trim().escape().not().isEmpty().withMessage('status is required').isBoolean().withMessage("status must be boolean"),
]

export const createStoreValidator = [
    body('name').trim().not().isEmpty().withMessage('Store name is required').isString().withMessage('Store name should be string').isLength({ min: 1 }).withMessage('Store name min length is 1'),
    body('email').trim().not().isEmpty().withMessage('Email is required').isEmail().normalizeEmail({ all_lowercase: true }).withMessage('Invalid Email'),
    body('contact').optional().trim().isMobilePhone('any').withMessage('Invalid phone number'), //
    body('address').optional().trim().isString(),
    body('bio').optional().trim().isString(),
]

export const updateStoreValidator = [
    body('name').trim().optional().isString().withMessage('Store name should be string').isLength({ min: 1 }).withMessage('Store name min length is 1'),
    body('contact').optional().trim().isMobilePhone('any').withMessage('Invalid phone number'), //
    body('address').optional().trim().isString(),
    body('bio').optional().trim().isString(),
]