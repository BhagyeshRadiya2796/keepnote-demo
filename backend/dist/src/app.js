"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const note_route_1 = __importDefault(require("./routes/note.route"));
const error_1 = require("./middlewares/error");
const config_1 = __importDefault(require("./config/config"));
require("./config/passport");
// Initialize Express app
const app = (0, express_1.default)();
// Connect to MongoDB
mongoose_1.default.connect(config_1.default.mongodbUri)
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
// Routes
app.use('/api/auth', auth_route_1.default);
app.use('/api/users', user_route_1.default);
app.use('/api/notes', note_route_1.default);
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to KeepNotes API' });
});
// Error handling middleware
app.use(error_1.errorConverter);
app.use(error_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map