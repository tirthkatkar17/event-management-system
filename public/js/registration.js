// public/js/registration.js

document.getElementById('student-registration-form').addEventListener('submit', handleStudentRegistration);

async function handleStudentRegistration(e) {
    e.preventDefault();
    const messageDisplay = document.getElementById('registration-message');
    messageDisplay.textContent = '';
    
    // Collect all form data
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());

    try {
        // POST /api/auth/register
        const result = await callApi('/auth/register', 'POST', userData);

        alert(result.message); // Should say: "Registration successful. Please log in."
        
        // After successful registration, redirect to login page
        window.location.href = '/login.html'; 

    } catch (error) {
        // Display backend error (e.g., "Email already in use.")
        messageDisplay.textContent = error.message; 
    }
}