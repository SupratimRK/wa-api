const { Router } = require('express');
const { sendMessageHandler } = require('../../handlers/messages.handler');
const { requireApiKey } = require('../../middlewares/auth.middleware');

const router = Router();

// POST /api/v1/messages/send
// Secured by API Key
router.post('/send', requireApiKey, sendMessageHandler);

module.exports = router;
