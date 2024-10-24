const jwt = require('jsonwebtoken');
const { secretKey } = require('../configuration/jwtConfig.js');

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: missing token' });
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer.toLowerCase() !== "bearer" || !token) {
        return res.status(401).json({ message: "Unauthorized: invalid token format" });
    }

    try {
        const user = verifyToken(token);
        req.user = user; // Attach user info to the request object
        next(); // Call next middleware or route handler
    } catch (err) {
        return res.status(403).json({ message: 'Forbidden: invalid token' });
    }
};

module.exports = { authenticateToken, verifyToken }; // Export using module.exports
