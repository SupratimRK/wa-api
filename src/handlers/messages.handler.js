const messageService = require('../services/messages.service');
const fs = require('fs');
const path = require('path');

/**
 * Express handler for sending a WhatsApp message
 */
async function sendMessageHandler(req, res, next) {
    try {
        const number = req.body.number;
        const message = req.body.message || ''; // Caption can be empty if media is present
        const mediaUrl = req.body.mediaUrl;
        const mediaBase64 = req.body.mediaBase64;
        
        let fileObj = null;
        if (req.file) {
             fileObj = req.file;
        }

        if (!number) {
            return res.status(400).json({ error: 'Number is required' });
        }
        
        if (!message && !mediaUrl && !mediaBase64 && !fileObj) {
            return res.status(400).json({ error: 'Either message or media must be provided' });
        }

        const result = await messageService.sendMessage(number, message, {
            mediaUrl,
            mediaBase64,
            fileObj
        });
        
        // Clean up multer file after sending
        if (fileObj && fileObj.path) {
            fs.unlink(fileObj.path, (err) => { if (err) console.error('Failed to clean up upload:', err); });
        }

        res.status(200).json(result);
    } catch (error) {
        next(error); // Passes the error to the global error middleware
    }
}

module.exports = {
    sendMessageHandler
};
