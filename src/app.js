const express = require('express');
const helmet = require('helmet');
const messagesRoutes = require('./routes/v1/messages.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Security middleware
app.use(helmet());

// Parses incoming JSON requests
app.use(express.json());

// Routes
app.use('/api/v1/messages', messagesRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
