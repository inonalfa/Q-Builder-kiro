import Joi from 'joi';

export const createPaymentSchema = {
  body: Joi.object({
    date: Joi.date()
      .required()
      .messages({
        'date.base': 'Payment date must be a valid date',
        'any.required': 'Payment date is required'
      }),
    
    amount: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be positive',
        'any.required': 'Amount is required'
      }),
    
    method: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'Payment method must be at least 2 characters long',
        'string.max': 'Payment method must be less than 50 characters long',
        'any.required': 'Payment method is required'
      }),
    
    note: Joi.string()
      .optional()
      .allow('')
      .max(1000)
      .messages({
        'string.max': 'Note must be less than 1000 characters long'
      }),
    
    receiptNumber: Joi.string()
      .optional()
      .allow('')
      .min(1)
      .max(50)
      .messages({
        'string.min': 'Receipt number must be at least 1 character long',
        'string.max': 'Receipt number must be less than 50 characters long'
      })
  })
};

export const updatePaymentSchema = {
  body: Joi.object({
    date: Joi.date()
      .optional()
      .messages({
        'date.base': 'Payment date must be a valid date'
      }),
    
    amount: Joi.number()
      .positive()
      .precision(2)
      .optional()
      .messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be positive'
      }),
    
    method: Joi.string()
      .min(2)
      .max(50)
      .optional()
      .messages({
        'string.min': 'Payment method must be at least 2 characters long',
        'string.max': 'Payment method must be less than 50 characters long'
      }),
    
    note: Joi.string()
      .optional()
      .allow('')
      .max(1000)
      .messages({
        'string.max': 'Note must be less than 1000 characters long'
      }),
    
    receiptNumber: Joi.string()
      .optional()
      .allow('')
      .min(1)
      .max(50)
      .messages({
        'string.min': 'Receipt number must be at least 1 character long',
        'string.max': 'Receipt number must be less than 50 characters long'
      })
  })
};

export const paymentParamsSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Payment ID must be a number',
        'number.integer': 'Payment ID must be an integer',
        'number.positive': 'Payment ID must be positive',
        'any.required': 'Payment ID is required'
      })
  })
};

export const projectPaymentParamsSchema = {
  params: Joi.object({
    projectId: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Project ID must be a number',
        'number.integer': 'Project ID must be an integer',
        'number.positive': 'Project ID must be positive',
        'any.required': 'Project ID is required'
      })
  })
};

export const paymentQuerySchema = {
  query: Joi.object({
    fromDate: Joi.date()
      .optional()
      .messages({
        'date.base': 'From date must be a valid date'
      }),
    
    toDate: Joi.date()
      .optional()
      .messages({
        'date.base': 'To date must be a valid date'
      }),
    
    method: Joi.string()
      .optional()
      .max(50)
      .messages({
        'string.max': 'Payment method must be less than 50 characters long'
      }),
    
    minAmount: Joi.number()
      .min(0)
      .precision(2)
      .optional()
      .messages({
        'number.base': 'Minimum amount must be a number',
        'number.min': 'Minimum amount must be at least 0'
      }),
    
    maxAmount: Joi.number()
      .min(0)
      .precision(2)
      .optional()
      .messages({
        'number.base': 'Maximum amount must be a number',
        'number.min': 'Maximum amount must be at least 0'
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
      .valid('date', 'amount', 'method', 'createdAt')
      .default('date')
      .optional()
      .messages({
        'any.only': 'Sort by must be one of: date, amount, method, createdAt'
      }),
    
    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
      .optional()
      .messages({
        'any.only': 'Sort order must be either asc or desc'
      })
  })
};