// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool using environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection on startup
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully! ✅');
        connection.release(); // Release the test connection back to the pool
    })
    .catch(err => {
        // Log the full error stack to diagnose connection issues (wrong password, server down, etc.)
        console.error('Database connection failed! Full Error Stack:'); 
        console.error(err.stack); 
        
        // **CRITICAL:** If the database connection fails, the application should exit.
        // If you are currently troubleshooting a "clean exit," comment out the line below 
        // when running 'node src/server.js' directly. Otherwise, keep it for production safety.
        // process.exit(1); 
    });

module.exports = pool;