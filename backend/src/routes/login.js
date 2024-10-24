// src/routes/login.js
const express = require('express');
const cors = require('cors');
const { Login, refreshToken } = require('../controllers/login.js'); // Destructure imports

const router = express.Router();
router.use(cors());

router.post('/login', Login); // Route for user login
router.post('/refresh-token', refreshToken);

module.exports = router; // Export using module.exports

