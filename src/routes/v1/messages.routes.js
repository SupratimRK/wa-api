const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const { sendMessageHandler } = require('../../handlers/messages.handler');
const { requireApiKey } = require('../../middlewares/auth.middleware');

const router = Router();

// Configure multer for temporary memory storage of uploads
const upload = multer({ dest: path.join(__dirname, '../../../uploads/') });

// POST /api/v1/messages/send
// Secured by API Key
router.post('/send', requireApiKey, upload.single('media'), sendMessageHandler);

module.exports = router;
