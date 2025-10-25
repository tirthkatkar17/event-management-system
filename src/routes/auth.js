// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db'); 

// --- Registration ---
router.post('/register', async (req, res) => {
    const { fullName, email, phone, college, password } = req.body;
    if (!email || !password || !fullName) {
        return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); 
        const sql = `
            INSERT INTO User (full_name, email, password_hash, phone_number, college_name, role)
            VALUES (?, ?, ?, ?, ?, 'student')
        `;
        await db.query(sql, [fullName, email, hashedPassword, phone, college]);

        res.status(201).json({ message: 'Registration successful. Please log in.' });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already in use.' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// --- Login ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM User WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        req.session.user = {
            id: user.user_id,
            fullName: user.full_name,
            email: user.email,
            role: user.role
        };

        res.status(200).json({
            message: 'Login successful.',
            role: user.role 
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }

    // src/routes/auth.js (Add this at the end before module.exports)

// --- Logout ---
router.post('/logout', (req, res) => {
    // Destroys the session data on the server
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out.' });
        }
        res.status(200).json({ message: 'Logged out successfully.' });
    });
});

// src/routes/auth.js (Add this route)

// --- Session Check ---
// Checks if a user is currently logged in
router.get('/check-session', (req, res) => {
    if (req.session.user && req.session.user.role === 'student') {
        return res.status(200).json({ 
            isLoggedIn: true, 
            userId: req.session.user.id 
        });
    }
    // Return 401 if user is not logged in or not a student
    return res.status(401).json({ isLoggedIn: false });
});

// ... (rest of file, including existing /logout route)
module.exports = router;

module.exports = router;
});

module.exports = router;