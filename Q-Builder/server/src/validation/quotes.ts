import Joi from 'joi';

export const quoteItemSchema = Joi.object({
  catalogItemId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'Catalog item ID must be a number',
      'number.integer': 'Catalog item ID must be an integer',
      'number.positive': 'Catalog item ID must be positive'
    }),
  
  description: Joi.string()
    .min(2)
    .max(500)
    .required()
    .messages({
      'string.min': 'Description must be at least 2 characters long',
      'string.max': 'Description must be less than 500 characters long',
      'any.required': 'Description is required'
    }),
  
  unit: Joi.string()
    .min(1)
    .max(20)
    .required()
    .messages({
      'string.min': 'Unit must be at least 1 character long',
      'string.max': 'Unit must be less than 20 characters long',
      'any.required': 'Unit is required'
    }),
  
  quantity: Joi.number()
    .positive()
    .precision(3)
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.positive': 'Quantity must be positive',
      'any.required': 'Quantity is required'
    }),
  
  unitPrice: Joi.number()
    .min(0)
    .precision(2)
    .required()
    .messages({
      'number.base': 'Unit price must be a number',
      'number.min': 'Unit price must be at least 0',
      'any.required': 'Unit price is required'
    })
});

export const createQuoteSchema = {
  body: Joi.object({
    clientId: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Client ID must be a number',
        'number.integer': 'Client ID must be an integer',
        'number.positive': 'Client ID must be positive',
        'any.required': 'Client ID is required'
      }),
    
    title: Joi.string()
      .min(2)
      .max(200)
      .required()
      .messages({
        'string.min': 'Title must be at least 2 characters long',
        'string.max': 'Title must be less than 200 characters long',
        'any.required': 'Title is required'
      }),
    
    issueDate: Joi.date()
      .required()
      .messages({
        'date.base': 'Issue date must be a valid date',
        'any.required': 'Issue date is required'
      }),
    
    expiryDate: Joi.date()
      .greater(Joi.ref('issueDate'))
      .required()
      .messages({
        'date.base': 'Expiry date must be a valid date',
        'date.greater': 'Expiry date must be after issue date',
        'any.required': 'Expiry date is required'
      }),
    
    currency: Joi.string()
      .length(3)
      .default('ILS')
      .optional()
      .messages({
        'string.length': 'Currency must be exactly 3 characters long'
      }),
    
    terms: Joi.string()
      .optional()
      .allow('')
      .max(2000)
      .messages({
        'string.max': 'Terms must be less than 2000 characters long'
      }),
    
    items: Joi.array()
      .items(quoteItemSchema)
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one quote item is required',
        'any.required': 'Quote items are required'
      })
  })
};

export const updateQuoteSchema = {
  body: Joi.object({
    clientId: Joi.number()
      .integer()
      .positive()
      .optional()
      .messages({
        'number.base': 'Client ID must be a number',
        'number.integer': 'Client ID must be an integer',
        'number.positive': 'Client ID must be positive'
      }),
    
    title: Joi.string()
      .min(2)
      .max(200)
      .optional()
      .messages({
        'string.min': 'Title must be at least 2 characters long',
        'string.max': 'Title must be less than 200 characters long'
      }),
    
    issueDate: Joi.date()
      .optional()
      .messages({
        'date.base': 'Issue date must be a valid date'
      }),
    
    expiryDate: Joi.date()
      .optional()
      .messages({
        'date.base': 'Expiry date must be a valid date'
      }),
    
    currency: Joi.string()
      .length(3)
      .optional()
      .messages({
        'string.length': 'Currency must be exactly 3 characters long'
      }),
    
    terms: Joi.string()
      .optional()
      .allow('')
      .max(2000)
      .messages({
        'string.max': 'Terms must be less than 2000 characters long'
      }),
    
    items: Joi.array()
      .items(quoteItemSchema)
      .min(1)
      .optional()
      .messages({
        'array.min': 'At least one quote item is required'
      })
  })
};

export const quoteParamsSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Quote ID must be a number',
        'number.integer': 'Quote ID must be an integer',
        'number.positive': 'Quote ID must be positive',
        'any.required': 'Quote ID is required'
      })
  })
};

export const quoteQuerySchema = {
  query: Joi.object({
    search: Joi.string()
      .optional()
      .allow('')
      .max(100)
      .messages({
        'string.max': 'Search term must be less than 100 characters long'
      }),
    
    status: Joi.string()
      .valid('draft', 'sent', 'accepted', 'rejected', 'expired')
      .optional()
      .messages({
        'any.only': 'Status must be one of: draft, sent, accepted, rejected, expired'
      }),
    
    clientId: Joi.number()
      .integer()
      .positive()
      .optional()
      .messages({
        'number.base': 'Client ID must be a number',
        'number.integer': 'Client ID must be an integer',
        'number.positive': 'Client ID must be positive'
      }),
    
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
      .valid('quoteNumber', 'title', 'status', 'totalAmount', 'issueDate', 'expiryDate', 'createdAt')
      .default('createdAt')
      .optional()
      .messages({
        'any.only': 'Sort by must be one of: quoteNumber, title, status, totalAmount, issueDate, expiryDate, createdAt'
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

export const updateQuoteStatusSchema = {
  body: Joi.object({
    status: Joi.string()
      .valid('draft', 'sent', 'accepted', 'rejected', 'expired')
      .required()
      .messages({
        'any.only': 'Status must be one of: draft, sent, accepted, rejected, expired',
        'any.required': 'Status is required'
      })
  })
};