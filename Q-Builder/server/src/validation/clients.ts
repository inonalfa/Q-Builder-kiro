import Joi from 'joi';

export const createClientSchema = {
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Client name must be at least 2 characters long',
        'string.max': 'Client name must be less than 100 characters long',
        'any.required': 'Client name is required'
      }),
    
    contactPerson: Joi.string()
      .min(2)
      .max(100)
      .optional()
      .allow('')
      .messages({
        'string.min': 'Contact person must be at least 2 characters long',
        'string.max': 'Contact person must be less than 100 characters long'
      }),
    
    phone: Joi.string()
      .required()
      .messages({
        'any.required': 'Phone number is required'
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    address: Joi.string()
      .required()
      .messages({
        'any.required': 'Address is required'
      }),
    
    notes: Joi.string()
      .optional()
      .allow('')
      .max(1000)
      .messages({
        'string.max': 'Notes must be less than 1000 characters long'
      })
  })
};

export const updateClientSchema = {
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Client name must be at least 2 characters long',
        'string.max': 'Client name must be less than 100 characters long'
      }),
    
    contactPerson: Joi.string()
      .min(2)
      .max(100)
      .optional()
      .allow('')
      .messages({
        'string.min': 'Contact person must be at least 2 characters long',
        'string.max': 'Contact person must be less than 100 characters long'
      }),
    
    phone: Joi.string()
      .optional()
      .messages({
        'string.base': 'Phone must be a string'
      }),
    
    email: Joi.string()
      .email()
      .optional()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    
    address: Joi.string()
      .optional()
      .messages({
        'string.base': 'Address must be a string'
      }),
    
    notes: Joi.string()
      .optional()
      .allow('')
      .max(1000)
      .messages({
        'string.max': 'Notes must be less than 1000 characters long'
      })
  })
};

export const clientParamsSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Client ID must be a number',
        'number.integer': 'Client ID must be an integer',
        'number.positive': 'Client ID must be positive',
        'any.required': 'Client ID is required'
      })
  })
};

export const clientQuerySchema = {
  query: Joi.object({
    search: Joi.string()
      .optional()
      .allow('')
      .max(100)
      .messages({
        'string.max': 'Search term must be less than 100 characters long'
      }),
    
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .optional()
      .messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
      }),
    
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20)
      .optional()
      .messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit must be at most 100'
      }),
    
    sortBy: Joi.string()
      .valid('name', 'email', 'createdAt', 'updatedAt')
      .default('name')
      .optional()
      .messages({
        'any.only': 'Sort by must be one of: name, email, createdAt, updatedAt'
      }),
    
    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('asc')
      .optional()
      .messages({
        'any.only': 'Sort order must be either asc or desc'
      })
  })
};