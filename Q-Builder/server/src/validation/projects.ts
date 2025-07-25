import Joi from 'joi';

export const createProjectSchema = {
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
    
    originQuoteId: Joi.number()
      .integer()
      .positive()
      .optional()
      .messages({
        'number.base': 'Origin quote ID must be a number',
        'number.integer': 'Origin quote ID must be an integer',
        'number.positive': 'Origin quote ID must be positive'
      }),
    
    name: Joi.string()
      .min(2)
      .max(200)
      .required()
      .messages({
        'string.min': 'Project name must be at least 2 characters long',
        'string.max': 'Project name must be less than 200 characters long',
        'any.required': 'Project name is required'
      }),
    
    description: Joi.string()
      .optional()
      .allow('')
      .max(2000)
      .messages({
        'string.max': 'Description must be less than 2000 characters long'
      }),
    
    startDate: Joi.date()
      .required()
      .messages({
        'date.base': 'Start date must be a valid date',
        'any.required': 'Start date is required'
      }),
    
    endDate: Joi.date()
      .greater(Joi.ref('startDate'))
      .optional()
      .messages({
        'date.base': 'End date must be a valid date',
        'date.greater': 'End date must be after start date'
      }),
    
    budget: Joi.number()
      .min(0)
      .precision(2)
      .required()
      .messages({
        'number.base': 'Budget must be a number',
        'number.min': 'Budget must be at least 0',
        'any.required': 'Budget is required'
      })
  })
};

export const updateProjectSchema = {
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
    
    name: Joi.string()
      .min(2)
      .max(200)
      .optional()
      .messages({
        'string.min': 'Project name must be at least 2 characters long',
        'string.max': 'Project name must be less than 200 characters long'
      }),
    
    description: Joi.string()
      .optional()
      .allow('')
      .max(2000)
      .messages({
        'string.max': 'Description must be less than 2000 characters long'
      }),
    
    status: Joi.string()
      .valid('active', 'completed', 'cancelled')
      .optional()
      .messages({
        'any.only': 'Status must be one of: active, completed, cancelled'
      }),
    
    startDate: Joi.date()
      .optional()
      .messages({
        'date.base': 'Start date must be a valid date'
      }),
    
    endDate: Joi.date()
      .optional()
      .messages({
        'date.base': 'End date must be a valid date'
      }),
    
    budget: Joi.number()
      .min(0)
      .precision(2)
      .optional()
      .messages({
        'number.base': 'Budget must be a number',
        'number.min': 'Budget must be at least 0'
      })
  })
};

export const projectParamsSchema = {
  params: Joi.object({
    id: Joi.number()
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

export const projectQuerySchema = {
  query: Joi.object({
    search: Joi.string()
      .optional()
      .allow('')
      .max(100)
      .messages({
        'string.max': 'Search term must be less than 100 characters long'
      }),
    
    status: Joi.string()
      .valid('active', 'completed', 'cancelled')
      .optional()
      .messages({
        'any.only': 'Status must be one of: active, completed, cancelled'
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
      .valid('name', 'status', 'budget', 'startDate', 'endDate', 'createdAt')
      .default('createdAt')
      .optional()
      .messages({
        'any.only': 'Sort by must be one of: name, status, budget, startDate, endDate, createdAt'
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

export const createProjectFromQuoteSchema = {
  body: Joi.object({
    quoteId: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Quote ID must be a number',
        'number.integer': 'Quote ID must be an integer',
        'number.positive': 'Quote ID must be positive',
        'any.required': 'Quote ID is required'
      }),
    
    name: Joi.string()
      .min(2)
      .max(200)
      .optional()
      .messages({
        'string.min': 'Project name must be at least 2 characters long',
        'string.max': 'Project name must be less than 200 characters long'
      }),
    
    description: Joi.string()
      .optional()
      .allow('')
      .max(2000)
      .messages({
        'string.max': 'Description must be less than 2000 characters long'
      }),
    
    startDate: Joi.date()
      .default(() => new Date())
      .optional()
      .messages({
        'date.base': 'Start date must be a valid date'
      }),
    
    endDate: Joi.date()
      .optional()
      .messages({
        'date.base': 'End date must be a valid date'
      })
  })
};