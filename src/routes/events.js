// src/routes/events.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const { isAdmin } = require('../middleware/auth');

// --- 1. GET ALL EVENTS (PUBLIC READ) ---
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT event_id, event_name, department, DATE_FORMAT(date, '%d-%m-%Y') as date, 
                   TIME_FORMAT(time, '%h:%i %p') as time, location, fee, max_attendees, description
            FROM Event
            ORDER BY date ASC, time ASC
        `;
        const [events] = await db.query(sql);

        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to retrieve events.' });
    }
});

// --- 2. CREATE EVENT (ADMIN) ---
router.post('/create', isAdmin, async (req, res) => {
    const { eventName, department, date, time, location, fee, maxAttendees, description } = req.body;
    try {
        const sql = `
            INSERT INTO Event (event_name, department, date, time, location, fee, max_attendees, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.query(sql, [eventName, department, date, time, location, fee, maxAttendees, description]);

        res.status(201).json({ message: 'Event created successfully!', eventId: result.insertId });

    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Failed to create event.' });
    }
});

// --- 3. UPDATE EVENT (ADMIN) ---
router.put('/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { eventName, department, date, time, location, fee, maxAttendees, description } = req.body;
    try {
        const sql = `
            UPDATE Event
            SET event_name = ?, department = ?, date = ?, time = ?, location = ?,
                fee = ?, max_attendees = ?, description = ?
            WHERE event_id = ?
        `;
        const [result] = await db.query(sql, [eventName, department, date, time, location, fee, maxAttendees, description, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        res.status(200).json({ message: 'Event updated successfully.' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Failed to update event.' });
    }
});

// --- 4. DELETE EVENT (ADMIN) ---
// src/routes/events.js

// --- DELETE EVENT (D) ---
// src/routes/events.js

// ... (other routes above)

// --- DELETE EVENT (D) ---
router.delete('/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    
    // CRITICAL: Initialize 'connection' variable outside the try block
    let connection; 

    try {
        // 1. Get a dedicated connection from the pool to run the transaction
        connection = await db.getConnection(); 
        
        // 2. Start the transaction on the obtained connection
        await connection.beginTransaction(); 

        // 3. Delete associated registrations first
        await connection.query('DELETE FROM Registration WHERE event_id = ?', [id]);

        // 4. Delete the event itself
        const [result] = await connection.query('DELETE FROM Event WHERE event_id = ?', [id]);

        if (result.affectedRows === 0) {
            await connection.rollback(); // Use connection for rollback
            connection.release(); // Release the connection immediately after rollback
            return res.status(404).json({ message: 'Event not found.' });
        }

        await connection.commit(); // Use connection for commit

        res.status(200).json({ message: 'Event and all registrations deleted successfully.' });

    } catch (error) {
        console.error('Error deleting event:', error);
        
        if (connection) { // Check if a connection was successfully obtained before rolling back
            await connection.rollback(); // Use connection for rollback
        }
        
        res.status(500).json({ message: 'Failed to delete event.' });
        
    } finally {
        // 5. Always release the connection in the finally block
        if (connection) {
            connection.release();
        }
    }
});

module.exports = router;

// --- 5. VIEW REGISTRATIONS (ADMIN) ---
router.get('/:id/registrations', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `
            SELECT 
                U.full_name, U.email, U.phone_number, U.college_name,
                R.registration_date, R.status
            FROM Registration R
            JOIN User U ON R.user_id = U.user_id
            WHERE R.event_id = ?
            ORDER BY R.registration_date ASC
        `;
        const [registrations] = await db.query(sql, [id]);
        const totalParticipants = registrations.length;

        res.status(200).json({
            event_id: id,
            total_participants: totalParticipants,
            registered_students: registrations 
        });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ message: 'Failed to retrieve event registrations.' });
    }
});

module.exports = router;