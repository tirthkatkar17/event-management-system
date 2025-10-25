// public/js/index.js
document.addEventListener('DOMContentLoaded', fetchAndDisplayEvents);

async function fetchAndDisplayEvents() {
    try {
        const events = await callApi('/events'); 
        
        const eventListContainer = document.getElementById('event-list');
        eventListContainer.innerHTML = ''; 

        if (events.length === 0) {
            eventListContainer.innerHTML = '<p>No upcoming events found.</p>';
            return;
        }

        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <h3>${event.event_name}</h3>
                <p><strong>Department:</strong> ${event.department}</p>
                <p>📍 ${event.location}</p>
                <p>📅 ${event.date} at ${event.time}</p>
                <p>Fee: ${event.fee === '0.00' ? 'Free' : `₹${event.fee}`}</p>
                <button onclick="handleRegisterClick(${event.event_id})">Register</button>
            `;
            eventListContainer.appendChild(eventCard);
        });

    } catch (error) {
        document.getElementById('event-list').innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// public/js/index.js (Corrected handleRegisterClick function)

// Function triggered when a user clicks 'Register'
function handleRegisterClick(eventId) {
    // CHANGE TARGET BACK TO THE EXISTING LOGIN PAGE
    window.location.href = `/login.html?event_id=${eventId}`; 
}