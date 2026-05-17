const crypto = require('crypto');
const { WEBHOOK_URL, WEBHOOK_SECRET } = require('../config/env');

/**
 * Generates an HMAC SHA256 signature for the given payload
 * @param {string} payload - JSON stringified payload
 * @returns {string} - HEX formatted signature
 */
function generateSignature(payload) {
    if (!WEBHOOK_SECRET) return '';
    return crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');
}

/**
 * Dispatches an incoming WhatsApp message to the external webhook
 * @param {Object} client - The WhatsApp client instance
 * @param {Object} message - The message object from whatsapp-web.js
 */
async function dispatchWebhook(client, message) {
    if (!WEBHOOK_URL) return; // Feature disabled if no URL is provided

    try {
        let actualNumber = message.from;

        // Resolve LID to Actual Phone Number (@c.us) if needed
        if (actualNumber.endsWith('@lid')) {
            try {
                const mapping = await client.getContactLidAndPhone([actualNumber]);
                if (mapping && mapping.length > 0 && mapping[0].pn) {
                    actualNumber = mapping[0].pn;
                }
            } catch (err) {
                console.error('[Webhook] Failed to resolve LID to Phone Number:', err.message);
            }
        }

        // Clean the number format (strip @c.us or @lid)
        const fromNumber = actualNumber.replace('@c.us', '').replace('@lid', '');

        const payloadObject = {
            id: message.id._serialized,
            from: fromNumber,
            body: message.body,
            timestamp: message.timestamp,
            hasMedia: message.hasMedia,
            mediaUrl: message.mediaUrl || null
        };

        const payloadString = JSON.stringify(payloadObject);
        const signature = generateSignature(payloadString);

        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Signature': `sha256=${signature}`
            },
            body: payloadString
        });

        if (!response.ok) {
            console.error(`[Webhook] Failed to dispatch. Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`[Webhook] Error dispatching webhook:`, error.message);
    }
}

module.exports = {
    dispatchWebhook
};
