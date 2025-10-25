// public/js/user.js

document.addEventListener('DOMContentLoaded', fetchRegisteredEvents);

// --- Fetch User's Registered Events ---
async function fetchRegisteredEvents() {
    try {
        // GET /api/user/my-events (Protected by isAuthenticated)
        const events = await callApi('/user/my-events'); 
        
        const listContainer = document.getElementById('my-events-list');
        listContainer.innerHTML = ''; 

        if (events.length === 0) {
            listContainer.innerHTML = '<p>You have not registered for any events yet. <a href="/index.html">Browse events here</a>.</p>';
            return;
        }

        events.forEach(event => {
            const statusClass = event.status === 'cancelled' ? 'cancelled' : 'registered';
            
            const eventCard = document.createElement('div');
            eventCard.className = `event-card ${statusClass}`;
            eventCard.innerHTML = `
                <h3>${event.event_name}</h3>
                <p>📍 ${event.location}</p>
                <p>📅 ${event.date}</p>
                <p>Status: <strong>${event.status.toUpperCase()}</strong></p>
                
                ${event.status !== 'cancelled' ? 
                    `<button class="btn secondary" onclick="handleCancelRegistration(${event.event_id})">Cancel Registration</button>` 
                    : '<p class="cancelled-message">Registration Cancelled</p>'}
            `;
            listContainer.appendChild(eventCard);
        });

    } catch (error) {
        document.getElementById('my-events-list').innerHTML = `<p class="error">Error loading events: ${error.message}</p>`;
    }
}

// --- Cancel Registration Logic ---
async function handleCancelRegistration(eventId) {
    if (!confirm('Are you sure you want to cancel your registration for this event?')) {
        return;
    }
    
    try {
        // PUT /api/user/cancel/:eventId (Protected by isAuthenticated)
        const result = await callApi(`/user/cancel/${eventId}`, 'PUT');
        
        alert(result.message);
        fetchRegisteredEvents(); // Refresh the list after cancellation

    } catch (error) {
        alert(`Cancellation failed: ${error.message}`);
    }
}

// --- Simple Logout Function (Needs backend API to destroy session) ---
function logout() {
    // Note: You should implement a POST /api/auth/logout route in auth.js
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
        window.location.href = '/login.html';
    });
}