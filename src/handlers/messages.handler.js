const messageService = require('../services/messages.service');

/**
 * Express handler for sending a WhatsApp message
 */
async function sendMessageHandler(req, res, next) {
    try {
        const { number, message } = req.body;

        if (!number || !message) {
            return res.status(400).json({ error: 'Number and message are required' });
        }

        const result = await messageService.sendMessage(number, message);
        res.status(200).json(result);
    } catch (error) {
        next(error); // Passes the error to the global error middleware
    }
}

module.exports = {
    sendMessageHandler
};
