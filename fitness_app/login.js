// login.js - Dummy Login Logic

// Select DOM elements
const loginForm = document.getElementById('login-form');
const loginTab = document.getElementById('tab-login');
const signupTab = document.getElementById('tab-signup');

// Simple Toggle Logic (Visual only for dummy version)
signupTab.addEventListener('click', () => {
    alert("This is a dummy login page. Please use the 'Log In' form with any username!");
});

// Handle Login Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop the form from submitting to a real server

    const formData = new FormData(e.target);
    const username = formData.get('username').trim();

    // Basic validation
    if (!username) {
        alert("Please enter a username.");
        return;
    }

    console.log(`Attempting dummy login for: ${username}`);

    // 1. Set the Session User (Simulates a logged-in state in LocalStorage)
    // This allows the main page to know who you are without a database.
    localStorage.setItem('areteUserId', 'dummy-user-id-999');
    localStorage.setItem('areteUsername', username);

    // 2. Initialize Dummy Data
    // We create a data object for this specific username so the dashboard isn't empty.
    const userDataKey = `areteData_${username}`;
    
    if (!localStorage.getItem(userDataKey)) {
        const defaultData = {
            goals: { workout: 30, sleep: 8, water: 2, steps: 10000 },
            history: {}, 
            cumulativePoints: 0,
        };
        localStorage.setItem(userDataKey, JSON.stringify(defaultData));
    }

    // 3. Redirect to 'main.html' as requested
    window.location.href = 'main.html';
});