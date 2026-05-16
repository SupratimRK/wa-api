const { API_KEY } = require('../config/env');

/**
 * Validates the API Key provided in the Authorization header.
 * Requests must include `Authorization: Bearer <API_KEY>` or x-api-key header.
 */
function requireApiKey(req, res, next) {
    const authHeader = req.headers['authorization'];
    const apiKeyHeader = req.headers['x-api-key'];

    let providedKey = apiKeyHeader;
    if (!providedKey && authHeader && authHeader.startsWith('Bearer ')) {
        providedKey = authHeader.split(' ')[1];
    }

    if (!providedKey || providedKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
    }

    next();
}

module.exports = {
    requireApiKey
};
