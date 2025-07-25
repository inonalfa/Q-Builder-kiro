import Joi from 'joi';

export const registerSchema = {
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name must be less than 100 characters long',
        'any.required': 'Name is required'
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .min(8)
      .max(128)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must be less than 128 characters long',
        'any.required': 'Password is required'
      }),
    
    businessName: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Business name must be at least 2 characters long',
        'string.max': 'Business name must be less than 100 characters long',
        'any.required': 'Business name is required'
      }),
    
    phone: Joi.string()
      .required()
      .messages({
        'any.required': 'Phone number is required'
      }),
    
    address: Joi.string()
      .required()
      .messages({
        'any.required': 'Address is required'
      }),
    
    professionIds: Joi.array()
      .items(Joi.number().integer().positive())
      .default([])
      .messages({
        'array.base': 'Profession IDs must be an array',
        'number.base': 'Each profession ID must be a number',
        'number.integer': 'Each profession ID must be an integer',
        'number.positive': 'Each profession ID must be positive'
      })
  })
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  })
};

export const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .optional(),
    
    businessName: Joi.string()
      .min(2)
      .max(100)
      .optional(),
    
    phone: Joi.string()
      .optional(),
    
    address: Joi.string()
      .optional(),
    
    professionIds: Joi.array()
      .items(Joi.number().integer().positive())
      .optional(),
    
    vatRate: Joi.number()
      .min(0)
      .max(1)
      .optional()
      .messages({
        'number.min': 'VAT rate must be at least 0',
        'number.max': 'VAT rate must be at most 1'
      }),
    
    notificationSettings: Joi.object({
      emailEnabled: Joi.boolean().optional(),
      quoteExpiry: Joi.boolean().optional(),
      paymentReminders: Joi.boolean().optional(),
      quoteSent: Joi.boolean().optional()
    }).optional()
  })
};

export const googleOAuthSchema = {
  body: Joi.object({
    idToken: Joi.string().optional(),
    code: Joi.string().optional(),
    redirectUri: Joi.string().uri().optional()
  }).or('idToken', 'code').messages({
    'object.missing': 'Either idToken or code is required'
  }).when(Joi.object({ code: Joi.exist() }).unknown(), {
    then: Joi.object({
      redirectUri: Joi.string().uri().required().messages({
        'any.required': 'redirectUri is required when using authorization code'
      })
    }).unknown()
  })
};

export const googleAuthUrlSchema = {
  query: Joi.object({
    redirectUri: Joi.string()
      .uri()
      .required()
      .messages({
        'string.uri': 'redirectUri must be a valid URL',
        'any.required': 'redirectUri is required'
      }),
    
    state: Joi.string()
      .optional()
      .messages({
        'string.base': 'state must be a string'
      })
  })
};

export const appleOAuthSchema = {
  body: Joi.object({
    idToken: Joi.string().optional(),
    code: Joi.string().optional(),
    redirectUri: Joi.string().uri().optional(),
    user: Joi.object({
      name: Joi.object({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional()
      }).optional()
    }).optional()
  }).or('idToken', 'code').messages({
    'object.missing': 'Either idToken or code is required'
  }).when(Joi.object({ code: Joi.exist() }).unknown(), {
    then: Joi.object({
      redirectUri: Joi.string().uri().required().messages({
        'any.required': 'redirectUri is required when using authorization code'
      })
    }).unknown()
  })
};

export const appleAuthUrlSchema = {
  query: Joi.object({
    redirectUri: Joi.string()
      .uri()
      .required()
      .messages({
        'string.uri': 'redirectUri must be a valid URL',
        'any.required': 'redirectUri is required'
      }),
    
    state: Joi.string()
      .optional()
      .messages({
        'string.base': 'state must be a string'
      })
  })
};