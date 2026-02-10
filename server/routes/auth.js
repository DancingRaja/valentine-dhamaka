'use strict';

const express = require('express');
const router = express.Router();

// Admin Authentication
router.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
    // Implement your admin authentication logic here
    if (username === 'admin' && password === 'admin123') {
        return res.status(200).json({ message: 'Admin login successful' });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
