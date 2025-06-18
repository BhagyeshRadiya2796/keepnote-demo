"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const mongoose_1 = require("mongoose");
const noteSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: 'UserProfile',
        required: [true, 'User is required'],
    },
}, { timestamps: true });
exports.Note = (0, mongoose_1.model)('Note', noteSchema, 'notes');
//# sourceMappingURL=note.model.js.map