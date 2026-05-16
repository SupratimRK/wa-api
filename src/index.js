const app = require('./app');
const { client } = require('./whatsapp/client');
const { PORT } = require('./config/env');

async function startServer() {
    console.log('Initializing WhatsApp Client...');
    client.initialize();

    app.listen(PORT, () => {
        console.log(`API Server is running on http://localhost:${PORT}`);
    });
}

startServer();
