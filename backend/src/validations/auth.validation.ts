import Joi from 'joi';

export const registerSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.email': 'Must be a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().label('Password'),
  }),
};

export const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.email': 'Must be a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().label('Password'),
  }),
};
