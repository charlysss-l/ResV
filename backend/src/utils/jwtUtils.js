const jwt = require('jsonwebtoken');
const { secretKey } = require('../configuration/jwtConfig.js'); // Ensure the correct import

const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };

    // Sign the token with the secret key and set expiration
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

module.exports = { generateToken }; // Export using module.exports
