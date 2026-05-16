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

    try {
        // Optional: Check if number exists (might slow down sending slightly, but prevents untracked errors)
        const isRegistered = await client.isRegisteredUser(chatId);
        if (!isRegistered) {
            const error = new Error('The phone number is not registered on WhatsApp.');
            error.status = 404;
            throw error;
        }

        await client.sendMessage(chatId, message);
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
