import { body, param, query } from 'express-validator';

export const validateRegister = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateLead = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').notEmpty().withMessage('Phone number is required'),
];

export const validateProperty = [
  body('title').notEmpty().withMessage('Property title is required'),
  body('propertyType').notEmpty().withMessage('Property type is required'),
  body('listingType').notEmpty().withMessage('Listing type is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('area').isFloat({ min: 0 }).withMessage('Area must be a positive number'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
];

export const validateContact = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
];

export const validateTask = [
  body('title').notEmpty().withMessage('Task title is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
];

export const validateId = [
  param('id').isUUID().withMessage('Invalid ID format'),
];