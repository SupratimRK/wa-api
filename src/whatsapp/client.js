const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
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
    // Stop processing if this message contains media
    if (msg.hasMedia) {
        console.log(`[IGNORED] Media message from: ${msg.from}`);
        return;
    }

    console.log(`[INCOMING] From: ${msg.from} | Message: ${msg.body}`);
    
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
