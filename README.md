# 🚀 Event Management System (EMS)

### A Full-Stack Event Management Application for Colleges and Institutions

The Event Management System is a robust web application designed to streamline the event creation, registration, and tracking process. It features separate, secure portals for **Administrators** (full CRUD control) and **Students** (seamless registration and dashboard viewing).

---

## 💻 Tech Stack

This project uses a standard, modern JavaScript-based stack:

| Component | Technology | Key Modules |
| :--- | :--- | :--- |
| **Frontend** | HTML, CSS, Vanilla JavaScript | Fetch API |
| **Backend** | Node.js (Express.js) | `express-session`, `dotenv` |
| **Database** | MySQL | `mysql2/promise` |
| **Authentication** | `bcrypt` | Password hashing |

---

## ✨ Features

### Student / Public Features

* **Browse Events:** View all current and upcoming events.
* **Seamless Registration:** When logged in, clicking 'Register' instantly enrolls the user into the event (no secondary forms).
* **User Dashboard:** View a personalized list of all registered events and manage cancellations.

### Administrator Features

* **Secure Access:** Protected routes ensured by `isAdmin` middleware.
* **CRUD Operations:** Full ability to **Create**, **Read**, **Update**, and **Delete** events.
* **Registration Management:** View a detailed list of all students registered for any specific event.

---

## 🛠️ Setup and Installation

Follow these steps to get the project running on your local machine.

### 1. Prerequisites

You must have the following software installed:

* **Node.js** (version 16+)
* **MySQL Server**

### 2. Database Setup

Using MySQL Workbench or your preferred client, execute the necessary SQL commands to set up the schema and tables (`User`, `Event`, `Registration`).

**Crucial Step:** Insert the Admin User, replacing `YOUR_BCRYPT_HASH_HERE` with a hash generated for your desired password (e.g., "admin123"):

```sql
INSERT INTO User (full_name, email, password_hash, role)
VALUES ('System Admin', 'admin@kit.edu', 'YOUR_BCRYPT_HASH_HERE', 'admin');
```

### 3. Project Configuration

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/tirthkatkar17/event-management-system.git](https://github.com/tirthkatkar17/event-management-system.git)
    cd event-management-system
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` File:** Create a file named **`.env`** in the project root and add your database credentials:
    ```env
    # .env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_DATABASE=event_management_db
    SESSION_SECRET=a_long_random_string_for_security
    PORT=3000
    ```

### 4. Run the Application

Start the server using nodemon for development:

```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## 🔑 Default Credentials for Testing

| Role | Email | Password | URL |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@kit.edu` | The plain-text password corresponding to your hash | `http://localhost:3000/login.html` |
| **Student** | (Register a new account) | (Your chosen password) | `http://localhost:3000/registration.html` |

---
