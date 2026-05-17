const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { dispatchWebhook } = require('../services/webhook.service');

// Initialize WhatsApp Client with LocalAuth to save session
const client = new Client({
    authStrategy: new LocalAuth(),
    // Puppeteer options can be added here if running on a server without GUI
});

client.on('qr', (qr) => {
    console.log('Scan the QR code below to authenticate:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

// Webhook / Message Listener: Receive incoming messages
client.on('message', async msg => {
    console.log(`[INCOMING] From: ${msg.from} | Message: ${msg.body}`);
    
    // Process media if the message contains any
    if (msg.hasMedia) {
        try {
            const media = await msg.downloadMedia();
            if (media) {
                const extension = media.mimetype.split('/')[1]?.split(';')[0] || 'bin';
                const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extension}`;
                const uploadDir = path.join(__dirname, '../../uploads');
                
                await fs.mkdir(uploadDir, { recursive: true });
                await fs.writeFile(path.join(uploadDir, filename), media.data, 'base64');
                
                msg.mediaUrl = `/uploads/${filename}`; // attach for webhook
                console.log(`[MEDIA] Downloaded media to: ${msg.mediaUrl}`);
            }
        } catch (err) {
            console.error('[MEDIA] Failed to download media:', err.message);
        }
    }

    // Simple echo/ping command for testing
    if (msg.body.toLowerCase() === '!ping') {
        msg.reply('pong');
    }

    // Forward the message to the configured external webhook securely
    await dispatchWebhook(client, msg);
});

module.exports = {
    client
};
