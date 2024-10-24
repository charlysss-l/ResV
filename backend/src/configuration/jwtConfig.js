const crypto = require('crypto');

// Generate a random secret key (you may want to store this securely)
const secretKey = crypto.randomBytes(32).toString('hex'); // Increased key size for better security

module.exports = { secretKey }; // Export using module.exports
