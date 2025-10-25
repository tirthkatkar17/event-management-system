// public/js/auth.js

// --- LOGIN HANDLER SETUP ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

// --- INITIAL CHECK ON PAGE LOAD ---
document.addEventListener('DOMContentLoaded', checkRegistrationRedirect);

async function checkRegistrationRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event_id');

    // Only proceed if an event ID is present (meaning the user clicked 'Register')
    if (!eventId) {
        return; 
    }

    try {
        // 1. Attempt to check session status
        const sessionData = await callApi('/auth/check-session', 'GET');
        
        if (sessionData.isLoggedIn) {
            // 2. SUCCESS: User is logged in. Skip login form and register event immediately.
            console.log("User is already logged in. Redirecting to register event.");
            await submitRegistration(eventId); // Go straight to registration process
        } else {
            // 3. FAILURE: User is not logged in. Keep the login form visible.
            console.log("User not logged in. Showing login prompt.");
            // Optional message to inform the user why they are seeing the form
            const messageDisplay = document.getElementById('login-message');
            if(messageDisplay) {
                messageDisplay.textContent = "Please log in to continue your event registration.";
            }
        }

    } catch (error) {
        // If check-session fails (e.g., 401 error handled by api.js), just show the login form.
        console.error("Session check failed or user not logged in.", error);
    }
}

// --- HANDLE LOGIN SUBMISSION ---
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('login-message');
    loginMessage.textContent = '';

    try {
        const data = await callApi('/auth/login', 'POST', { email, password });

        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('event_id');
        
        // Handle Admin login
        if (data.role === 'admin') {
            window.location.href = '/admin-dashboard.html';
        } 
        // Handle Student login
        else if (eventId) {
            // CRITICAL CHANGE: Student logs in AND has an eventId, register them immediately.
            await submitRegistration(eventId); 
        } else {
            // Normal student login without a specific registration target
            window.location.href = '/user-dashboard.html'; 
        }

    } catch (error) {
        loginMessage.textContent = error.message; 
    }
}

// --- HELPER FUNCTION: Final API call for Registration ---
// This function is called both when the user is already logged in (seamless) 
// and immediately after a successful login (post-login register).
async function submitRegistration(eventId) {
    try {
        // POST /api/user/register/:eventId (This is the final registration action)
        const result = await callApi(`/user/register/${eventId}`, 'POST');

        alert(`${result.message}. Redirecting to your dashboard.`);
        window.location.href = '/user-dashboard.html';

    } catch (error) {
        // Handle errors like "already registered"
        alert(`Registration failed: ${error.message}`);
        window.location.href = '/user-dashboard.html'; // Send them to dashboard anyway
    }
}