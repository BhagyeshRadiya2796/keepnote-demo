"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const note_controller_1 = require("../controllers/note.controller");
const validate_1 = require("../middlewares/validate");
const note_validation_1 = require("../validations/note.validation");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// All note routes are protected
router.get('/', auth_1.authenticate, note_controller_1.noteController.getNotes);
router.post('/', auth_1.authenticate, (0, validate_1.validate)(note_validation_1.createNoteSchema), note_controller_1.noteController.createNote);
router.put('/:noteId', auth_1.authenticate, (0, validate_1.validate)(note_validation_1.updateNoteSchema), note_controller_1.noteController.updateNote);
router.delete('/:noteId', auth_1.authenticate, (0, validate_1.validate)(note_validation_1.deleteNoteSchema), note_controller_1.noteController.deleteNote);
exports.default = router;
//# sourceMappingURL=note.route.js.map