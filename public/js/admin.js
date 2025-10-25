// public/js/admin.js
document.addEventListener('DOMContentLoaded', fetchAdminEvents);

// --- SETUP: LISTEN FOR CREATE EVENT FORM SUBMISSION ---
document.addEventListener('DOMContentLoaded', () => {
    const createForm = document.getElementById('create-event-form');
    if (createForm) {
        createForm.addEventListener('submit', handleCreateEvent);
    }
});

// --- NEW FUNCTION: HANDLE EVENT CREATION ---
async function handleCreateEvent(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const eventData = Object.fromEntries(formData.entries());

    try {
        // POST /api/events/create (Protected by isAdmin middleware)
        const result = await callApi('/events/create', 'POST', eventData);
        
        alert(result.message);
        
        // 1. Close the modal
        const modal = document.getElementById('create-event-modal');
        if (modal) modal.style.display = 'none'; 
        
        // 2. Refresh the event list
        fetchAdminEvents(); 
        
        // 3. Clear the form fields for next use (optional)
        e.target.reset();

    } catch (error) {
        alert(`Event creation failed: ${error.message}`);
    }
}
// ---------------------------------------------------


// --- 1. FETCH ALL EVENTS FOR ADMIN ---
async function fetchAdminEvents() {
    try {
        // Re-use the public endpoint, relying on the admin page being protected
        const events = await callApi('/events'); 
        
        const tableBody = document.getElementById('admin-event-table-body');
        tableBody.innerHTML = ''; 

        events.forEach(event => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${event.event_name}</td>
                <td>${event.date}</td>
                <td>${event.location}</td>
                <td>${event.max_attendees || 'N/A'}</td>
                <td>
                    <button onclick="viewRegistrations(${event.event_id})">View (${event.event_id})</button>
                    <button onclick="openEditModal(${event.event_id})">Edit</button>
                    <button onclick="handleDelete(${event.event_id})">Delete</button>
                </td>
            `;
        });
    } catch (error) {
        document.getElementById('admin-events-container').innerHTML = `<p class="error">Access Denied or Error: ${error.message}</p>`;
    }
}

// --- 2. HANDLE DELETE ---
// public/js/admin.js

async function handleDelete(eventId) {
    if (!confirm(`Are you sure you want to delete Event ID ${eventId} and all registrations?`)) {
        return;
    }

    try {
        // CRITICAL: Ensure the URL format and method are correct
        const result = await callApi(`/events/${eventId}`, 'DELETE'); 
        alert(result.message);
        fetchAdminEvents(); 
    } catch (error) {
        // This 'catch' block displays the "Deletion failed: Failed to fetch" alert.
        alert(`Deletion failed: ${error.message}`);
    }
}

// --- 3. VIEW REGISTRATIONS ---
async function viewRegistrations(eventId) {
    try {
        const data = await callApi(`/events/${eventId}/registrations`);
        
        displayRegistrationList(data.registered_students, data.total_participants, eventId);
        
        // Show the modal after data is loaded
        const modal = document.getElementById('registration-modal');
        if (modal) modal.style.display = 'block';

    } catch (error) {
        alert(`Failed to fetch registrations: ${error.message}`);
    }
}

function displayRegistrationList(students, total, eventId) {
    const listContainer = document.getElementById('registered-students-list'); 
    listContainer.innerHTML = `
        <h3>Registrations for Event ID ${eventId}</h3>
        <p>Total Participants: <strong>${total}</strong></p>
    `;

    if (students.length === 0) {
        listContainer.innerHTML += '<p>No students have registered yet.</p>';
    } else {
        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr><th>Name</th><th>Email</th><th>Phone</th><th>College</th><th>Registered On</th></tr>
                </thead>
                <tbody>
                    ${students.map(s => `
                        <tr>
                            <td>${s.full_name}</td>
                            <td>${s.email}</td>
                            <td>${s.phone_number || 'N/A'}</td>
                            <td>${s.college_name || 'N/A'}</td>
                            <td>${new Date(s.registration_date).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        listContainer.innerHTML += tableHTML;
    }
}

// Placeholder functions to avoid errors (you can implement these later)
function openEditModal(eventId) {
    alert(`Edit functionality triggered for Event ID: ${eventId}. Implementation pending.`);
}