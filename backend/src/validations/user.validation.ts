import Joi from 'joi';

export const createUserSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.email': 'Must be a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().label('Password'),
  }),
};

export const getUserSchema = {
  params: Joi.object().keys({
    userId: Joi.string().required().messages({
      'any.required': 'User ID is required',
    }),
  }),
};
