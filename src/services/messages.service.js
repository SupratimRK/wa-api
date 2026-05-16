const { client } = require('../whatsapp/client');

/**
 * Sends a WhatsApp message to a specific number
 * @param {string} number - The recipient's phone number without + or spaces
 * @param {string} message - The text message to send
 * @returns {Promise<Object>} - Contains success status and chatId
 */
async function sendMessage(number, message) {
    if (!client.info) {
        throw new Error('WhatsApp client is not ready yet.');
    }

    // Default formatting logic for regular contacts
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const chatId = `${sanitizedNumber}@c.us`;

    await client.sendMessage(chatId, message);
    return { success: true, message: 'Message sent successfully', chatId };
}

module.exports = {
    sendMessage
};
