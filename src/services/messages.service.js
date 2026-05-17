const { client } = require('../whatsapp/client');
const { MessageMedia } = require('whatsapp-web.js');
let fetch;
import('node-fetch').then(m => fetch = m.default).catch(() => fetch = global.fetch);

/**
 * Sends a WhatsApp message to a specific number
 * @param {string} number - The recipient's phone number without + or spaces
 * @param {string} message - The text message to send
 * @param {Object} mediaOptions - Options for sending media
 * @returns {Promise<Object>} - Contains success status and chatId
 */
async function sendMessage(number, message, mediaOptions = {}) {
    if (!client.info) {
        throw new Error('WhatsApp client is not ready yet.');
    }

    // Default formatting logic for regular contacts
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const chatId = `${sanitizedNumber}@c.us`;

    try {
        // Optional: Check if number exists 
        const isRegistered = await client.isRegisteredUser(chatId);
        if (!isRegistered) {
            const error = new Error('The phone number is not registered on WhatsApp.');
            error.status = 404;
            throw error;
        }
        
        let media = null;
        if (mediaOptions.mediaUrl) {
            media = await MessageMedia.fromUrl(mediaOptions.mediaUrl);
        } else if (mediaOptions.mediaBase64) {
            // Assumes format: data:image/png;base64,..... or just raw base64
            let data = mediaOptions.mediaBase64;
            let mimetype = 'application/octet-stream';
            if (data.includes(',')) {
                const parts = data.split(',');
                mimetype = parts[0].split(':')[1].split(';')[0];
                data = parts[1];
            }
            media = new MessageMedia(mimetype, data);
        } else if (mediaOptions.fileObj) {
            const fs = require('fs');
            const data = fs.readFileSync(mediaOptions.fileObj.path, { encoding: 'base64' });
            media = new MessageMedia(mediaOptions.fileObj.mimetype, data, mediaOptions.fileObj.originalname);
        }

        const options = {};
        if (message) options.caption = message; // Caption works for media too

        if (media) {
            await client.sendMessage(chatId, media, options);
        } else {
            await client.sendMessage(chatId, message);
        }
        return { success: true, message: 'Message sent successfully', chatId };
    } catch (error) {
        if (error.message && error.message.includes('No LID for user')) {
            const newError = new Error('Invalid phone number or user not found on WhatsApp.');
            newError.status = 400;
            throw newError;
        }
        throw error;
    }
}

module.exports = {
    sendMessage
};
