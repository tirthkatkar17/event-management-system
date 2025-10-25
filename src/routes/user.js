// src/routes/user.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const { isAuthenticated } = require('../middleware/auth');

// --- 1. REGISTER FOR EVENT (USER) ---
router.post('/register/:eventId', isAuthenticated, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.session.user.id; 

    try {
        const [existing] = await db.query(
            'SELECT * FROM Registration WHERE user_id = ? AND event_id = ?', 
            [userId, eventId]
        );
        if (existing.length > 0) {
            return res.status(409).json({ message: 'You are already registered for this event.' });
        }
        
        // **Capacity Check (Optional but recommended)**
        const [eventData] = await db.query('SELECT max_attendees FROM Event WHERE event_id = ?', [eventId]);
        const maxAttendees = eventData[0]?.max_attendees;
        
        if (maxAttendees) {
            const [currentCount] = await db.query('SELECT COUNT(*) as count FROM Registration WHERE event_id = ? AND status != "cancelled"', [eventId]);
            if (currentCount[0].count >= maxAttendees) {
                 return res.status(403).json({ message: 'Registration failed: Event is full.' });
            }
        }
        // **End Capacity Check**

        const sql = `
            INSERT INTO Registration (user_id, event_id, status)
            VALUES (?, ?, 'registered')
        `;
        await db.query(sql, [userId, eventId]);

        res.status(201).json({ message: 'Successfully registered for the event!' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Failed to complete registration.' });
    }
});

// --- 2. VIEW REGISTERED EVENTS (USER) ---
router.get('/my-events', isAuthenticated, async (req, res) => {
    const userId = req.session.user.id;

    try {
        const sql = `
            SELECT 
                E.event_id, E.event_name, E.location, 
                DATE_FORMAT(E.date, '%d-%m-%Y') as date, 
                R.registration_date, R.status
            FROM Registration R
            JOIN Event E ON R.event_id = E.event_id
            WHERE R.user_id = ?
            ORDER BY E.date ASC
        `;
        const [myEvents] = await db.query(sql, [userId]);

        res.status(200).json(myEvents);
    } catch (error) {
        console.error('Error fetching registered events:', error);
        res.status(500).json({ message: 'Failed to retrieve your registered events.' });
    }
});

// --- 3. CANCEL REGISTRATION (USER) ---
router.put('/cancel/:eventId', isAuthenticated, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.session.user.id;

    try {
        const [eventResult] = await db.query('SELECT date FROM Event WHERE event_id = ?', [eventId]);
        if (eventResult.length === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        
        const eventDate = new Date(eventResult[0].date);
        const today = new Date();
        
        if (eventDate <= today) {
            return res.status(403).json({ message: 'Cannot cancel registration: the event date has passed.' });
        }

        const sql = `
            UPDATE Registration 
            SET status = 'cancelled' 
            WHERE user_id = ? AND event_id = ? AND status != 'cancelled'
        `;
        const [result] = await db.query(sql, [userId, eventId]);

        if (result.affectedRows === 0) {
             return res.status(400).json({ message: 'Registration not found or already cancelled.' });
        }

        res.status(200).json({ message: 'Registration successfully cancelled.' });

    } catch (error) {
        console.error('Cancellation error:', error);
        res.status(500).json({ message: 'Failed to cancel registration.' });
    }
});

module.exports = router;