-- 1. Create the Database
CREATE DATABASE event_management_db;
USE event_management_db;

-- 2. Create the User Table
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    college_name VARCHAR(255),
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student'
);

-- 3. Create the Event Table
CREATE TABLE Event (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    max_attendees INT,
    description TEXT
);

-- 4. Create the Registration Table (Junction)
CREATE TABLE Registration (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('registered', 'paid', 'cancelled') DEFAULT 'registered',
    
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE,
    
    -- Ensure a user can only register for an event once
    UNIQUE KEY unique_registration (user_id, event_id)
);

-- 5. Insert Initial Admin (Password must be generated using bcrypt, e.g., 'password123' hashed)
-- You must generate a hash and replace 'YOUR_ADMIN_HASH'
INSERT INTO User (full_name, email, password_hash, role)
VALUES ('System Admin', 'admin@kit.edu', 'YOUR_ADMIN_HASH', 'admin');

-- Update the password_hash for the admin@kit.edu user
UPDATE User 
SET password_hash = '$2b$10$Hbh1ptiFukXJSunk5EFUpO8fnHfNxF4ElvW4WpbfsyYb3MIIWWk06' 
WHERE email = 'admin@kit.edu';