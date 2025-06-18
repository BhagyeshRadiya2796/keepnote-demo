import Joi from 'joi';

export const createNoteSchema = {
  body: Joi.object().keys({
    title: Joi.string().required().messages({
      'any.required': 'Title is required',
    }),
    content: Joi.string().required().messages({
      'any.required': 'Content is required',
    }),
  }),
};

export const updateNoteSchema = {
  params: Joi.object().keys({
    noteId: Joi.string().required().messages({
      'any.required': 'Note ID is required',
    }),
  }),
  body: Joi.object().keys({
    title: Joi.string().messages({
      'string.empty': 'Title cannot be empty',
    }),
    content: Joi.string().messages({
      'string.empty': 'Content cannot be empty',
    }),
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update',
  }),
};

export const deleteNoteSchema = {
  params: Joi.object().keys({
    noteId: Joi.string().required().messages({
      'any.required': 'Note ID is required',
    }),
  }),
};
