const express = require('express');
const helmet = require('helmet');
const path = require('path');
const messagesRoutes = require('./routes/v1/messages.routes');
const { errorHandler } = require('./middlewares/error.middleware');
const { requireApiKey } = require('./middlewares/auth.middleware');

const app = express();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: false }));

// Parses incoming JSON requests and URL encoded
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Secure static uploads folder
// Requires x-api-key header or api_key query param (handled in requireApiKey)
app.use('/uploads', requireApiKey, express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1/messages', messagesRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
