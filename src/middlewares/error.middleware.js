/**
 * Global error handler middleware for Express
 */
function errorHandler(err, req, res, next) {
    if (process.env.NODE_ENV !== 'test') {
        console.error('[Error Details]:', err.message || err);
    }
    
    // Customize messaging based on whatsapp-web.js errors or custom statuses
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';

    if (message.includes('Protocol error')) {
        status = 502;
        message = 'WhatsApp client encountered a protocol error. Please try again.';
    } else if (message.includes('Evaluation failed')) {
        status = 500;
        message = 'WhatsApp client evaluation failed.';
    }

    res.status(status).json({
        success: false,
        error: message
    });
}

module.exports = {
    errorHandler
};
