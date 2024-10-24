const { loGin, refreshTokenService } = require('../services/login.js');

const Login = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body to check the received data
        const { email, password } = req.body; // Extract email and password from request body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const token = await loGin(email, password); // Call the login function
        res.json({ token }); // Return the token in the response
    } catch (error) {
        console.log('Login error:', error.message);
        res.status(401).json({ message: "Invalid credentials" }); // Return error message
    }
};

const refreshToken = async (req, res) => {
    try {
        const { token } = req.body; // Extract the token from the request body
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }
        const newToken = await refreshTokenService(token); // Pass the token to the service
        res.json({ newToken }); // Send the new token in the response
    } catch (error) {
        console.log('Refresh token error:', error.message);
        res.status(401).json({ message: 'Invalid token' }); // Return error message
    }
};

module.exports = { Login, refreshToken }; // Export using module.exports
