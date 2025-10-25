// public/js/api.js
const API_BASE_URL = '/api'; 

async function callApi(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        
        if (response.status === 401 || response.status === 403) {
            // Redirect to login on unauthorized access
            window.location.href = '/login.html'; 
            throw new Error('Access denied. Redirecting to login.');
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP error! Status: ${response.status}`);
        }

        return response.json();

    } catch (error) {
        console.error(`API Call Failed (${method} ${endpoint}):`, error);
        throw error; 
    }
}