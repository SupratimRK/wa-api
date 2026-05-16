const { loadEnvFile } = require('node:process');

const envType = process.env.NODE_ENV || 'development';

try {
    // Attempt to load environment-specific .env file first (e.g., .env.development or .env.production)
    loadEnvFile(`.env.${envType}`);
} catch (error) {
    try {
        // Fallback to default '.env' if specific file doesn't exist
        loadEnvFile();
    } catch (fallbackError) {
        // Ignore error if neither .env exist (could be relying on process.env injects directly)
    }
}

module.exports = {
    PORT: process.env.PORT || 3000,
    API_KEY: process.env.API_KEY || 'default-secret-key', // Used to secure incoming API requests
    WEBHOOK_URL: process.env.WEBHOOK_URL || '',           // The external URL where incoming messages are sent
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || ''      // Used to sign outgoing webhook payloads
};
