"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNoteSchema = exports.updateNoteSchema = exports.createNoteSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createNoteSchema = {
    body: joi_1.default.object().keys({
        title: joi_1.default.string().required().messages({
            'any.required': 'Title is required',
        }),
        content: joi_1.default.string().required().messages({
            'any.required': 'Content is required',
        }),
    }),
};
exports.updateNoteSchema = {
    params: joi_1.default.object().keys({
        noteId: joi_1.default.string().required().messages({
            'any.required': 'Note ID is required',
        }),
    }),
    body: joi_1.default.object().keys({
        title: joi_1.default.string().messages({
            'string.empty': 'Title cannot be empty',
        }),
        content: joi_1.default.string().messages({
            'string.empty': 'Content cannot be empty',
        }),
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update',
    }),
};
exports.deleteNoteSchema = {
    params: joi_1.default.object().keys({
        noteId: joi_1.default.string().required().messages({
            'any.required': 'Note ID is required',
        }),
    }),
};
//# sourceMappingURL=note.validation.js.map