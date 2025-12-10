// --- 1. CONSTANTS AND LOCAL STORAGE KEY ---

const DATE_OPTIONS = { year: 'numeric', month: 'short', day: 'numeric' };

// --- AUTH CHECK & DATA SETUP ---
const CURRENT_USERNAME = localStorage.getItem('areteUsername');

if (!CURRENT_USERNAME) {
    // If no username is found, kick the user back to the login page
    window.location.href = 'login.html';
}

// Local storage key for user-specific data
const USER_DATA_KEY = `areteData_${CURRENT_USERNAME}`;

const METRIC_DETAILS = {
    workout: { name: 'Workout Minutes', unit: 'min', type: 'number', step: 1, icon: 'dumbbell', color: 'red-500', points: 10 },
    sleep: { name: 'Sleep Hours', unit: 'hrs', type: 'number', step: 0.5, icon: 'moon', color: 'indigo-500', points: 5 },
    water: { name: 'Water Intake', unit: 'L', type: 'number', step: 0.1, icon: 'droplet', color: 'blue-500', points: 3 },
    steps: { name: 'Steps Count', unit: 'steps', type: 'number', step: 100, icon: 'footprints', color: 'green-500', points: 5 },
    diet: { name: 'Nutrient Check', unit: '', type: 'checkbox', step: 1, icon: 'carrot', color: 'yellow-500', points: 7 },
};

const RANK_THRESHOLDS = {
    'Rookie': 0,
    'Aspirant': 500,
    'Prodigy': 1500,
    'Master': 4000,
    'Elite': 8000
};


// Global state object
let userData = {
    goals: { workout: 30, sleep: 8, water: 2, steps: 10000 },
    history: {}, 
    cumulativePoints: 0,
};

// --- UTILITY FUNCTIONS ---

const getTodayDateKey = () => new Date().toISOString().slice(0, 10);

const getRankDetails = (points) => {
    let rank = 'Rookie';
    let nextRankPoints = Infinity;
    let nextThreshold = Infinity;

    // Find current rank
    for (const [r, threshold] of Object.entries(RANK_THRESHOLDS)) {
        if (points >= threshold) {
            rank = r;
        }
    }

    // Find points to next rank
    let foundNext = false;
    for (const [r, threshold] of Object.entries(RANK_THRESHOLDS).sort((a, b) => a[1] - b[1])) {
        if (points < threshold) {
            nextThreshold = threshold;
            nextRankPoints = nextThreshold - points;
            foundNext = true;
            break;
        }
    }
    
    return {
        name: rank,
        pointsToNext: foundNext ? nextRankPoints : 0,
    };
};

const calculatePoints = (metricId, value, goal) => {
    const details = METRIC_DETAILS[metricId];
    if (metricId === 'diet') {
        return value > 0 ? details.points : 0; // Diet is a simple met/not met
    }
    return value >= goal ? details.points : Math.floor((value / goal) * details.points);
};


// --- 2. LOCAL DATA HANDLERS (MOCK API) ---

const loadData = () => {
    const savedData = localStorage.getItem(USER_DATA_KEY);
    if (savedData) {
        userData = JSON.parse(savedData);
    }
    
    // Ensure history entry exists for today
    const todayKey = getTodayDateKey();
    if (!userData.history[todayKey]) {
        userData.history[todayKey] = { workout: 0, sleep: 0, water: 0, steps: 0, diet: 0, points: 0 };
    }
    
    // Re-calculate total points from history for robust data integrity
    userData.cumulativePoints = Object.values(userData.history).reduce((total, entry) => total + entry.points, 0);

    renderDashboard();
    renderGoalForm();
    renderProgress();
};

const saveData = () => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

const handleGoalSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    userData.goals.workout = parseFloat(formData.get('workout')) || 30;
    userData.goals.sleep = parseFloat(formData.get('sleep')) || 8;
    userData.goals.water = parseFloat(formData.get('water')) || 2;
    userData.goals.steps = parseInt(formData.get('steps')) || 10000;

    saveData();
    showMessage('Daily goals updated successfully!');
    renderGoalForm(); // Rerender to show updated values
};

const handleModalSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const metricId = formData.get('metricId');
    const todayKey = getTodayDateKey();
    let logValue = 0;
    
    // Diet is simplified to just check the box for 'met'
    if (metricId === 'diet') {
        // For simplicity, we just set diet to 1 if the user clicked the log button.
        logValue = 1;
    } else {
        logValue = parseFloat(formData.get('logValue')) || 0;
    }

    const goal = userData.goals[metricId];
    const newPoints = calculatePoints(metricId, logValue, goal);
    const oldEntry = userData.history[todayKey];
    
    // Update daily entry, but recalculate today's total points based on all metrics
    oldEntry[metricId] = logValue;
    
    let todayTotalPoints = 0;
    for(const id of Object.keys(METRIC_DETAILS)) {
        const val = oldEntry[id];
        const g = userData.goals[id];
        todayTotalPoints += calculatePoints(id, val, g);
    }
    
    oldEntry.points = todayTotalPoints;

    saveData();
    loadData(); // Reload and re-render the dashboard with new totals
    
    closeLogModal();
    showMessage(`Progress logged! New today score: ${todayTotalPoints} pts`);
};


// --- 3. RENDERING FUNCTIONS ---

const renderDashboard = () => {
    const todayKey = getTodayDateKey();
    const todayEntry = userData.history[todayKey] || { workout: 0, sleep: 0, water: 0, steps: 0, diet: 0, points: 0 };
    const rankDetails = getRankDetails(userData.cumulativePoints);
    
    document.getElementById('total-points').textContent = userData.cumulativePoints.toLocaleString();
    document.getElementById('user-rank').textContent = rankDetails.name;
    document.getElementById('today-points').textContent = todayEntry.points;
    document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    document.getElementById('next-rank-points').textContent = rankDetails.pointsToNext > 0 ? rankDetails.pointsToNext.toLocaleString() : 'Max Rank!';

    const currentRank = { 
        name: rankDetails.name, 
        badge: rankDetails.name === 'Elite' ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-2xl shadow-cyan-800/50 animation-pulse-glow-elite' : 'bg-gray-700 text-gray-200' 
    };
    const rankBadgeContainer = document.getElementById('rank-badge-container');
    rankBadgeContainer.className = 'rank-badge mt-3 p-3 rounded-full shadow-xl ' + currentRank.badge;

    const updateProgressBar = (id, value, goal) => {
        const details = METRIC_DETAILS[id];
        let percent = id === 'diet' ? (value > 0 ? 100 : 0) : Math.min(100, (value / goal) * 100);
        let valueText = id === 'diet' ? (value > 0 ? 'Goal Met' : 'Not Logged') : `${value.toLocaleString()} / ${goal.toLocaleString()} ${details.unit}`;

        const progressBar = document.getElementById(`${id}-progress`);
        const valueEl = document.getElementById(`${id}-value`);
        
        valueEl.textContent = valueText;
        progressBar.style.width = `${percent}%`;
        progressBar.style.backgroundColor = `var(--tw-colors-${details.color})`;
    };

    updateProgressBar('workout', todayEntry.workout, userData.goals.workout);
    updateProgressBar('sleep', todayEntry.sleep, userData.goals.sleep);
    updateProgressBar('water', todayEntry.water, userData.goals.water);
    updateProgressBar('steps', todayEntry.steps, userData.goals.steps);
    updateProgressBar('diet', todayEntry.diet, 1); 

    lucide.createIcons();
};

const renderGoalForm = () => {
    document.getElementById('goal-workout').value = userData.goals.workout;
    document.getElementById('goal-sleep').value = userData.goals.sleep;
    document.getElementById('goal-water').value = userData.goals.water;
    document.getElementById('goal-steps').value = userData.goals.steps;
};

const renderProgress = () => {
    renderCumulativeMilestones();
    renderHistoryTable();
    renderPointsChart();
};

const renderCumulativeMilestones = () => {
    let totalWorkout = 0;
    let totalSleep = 0;
    let totalWater = 0;
    let totalSteps = 0;
    let totalDietDays = 0;

    for (const entry of Object.values(userData.history)) {
        totalWorkout += entry.workout || 0;
        totalSleep += entry.sleep || 0;
        totalWater += entry.water || 0;
        totalSteps += entry.steps || 0;
        if (entry.diet > 0) totalDietDays += 1;
    }

    document.getElementById('total-workout').textContent = `${totalWorkout.toLocaleString()} mins`;
    document.getElementById('total-sleep').textContent = `${totalSleep.toLocaleString(undefined, { maximumFractionDigits: 1 })} hrs`;
    document.getElementById('total-water').textContent = `${totalWater.toLocaleString(undefined, { maximumFractionDigits: 1 })} L`;
    document.getElementById('total-steps').textContent = totalSteps.toLocaleString();
    document.getElementById('total-diet-days').textContent = totalDietDays.toLocaleString();
};

const renderHistoryTable = () => {
    const tableBody = document.getElementById('history-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    const sortedDates = Object.keys(userData.history).sort().reverse();
    const recentDates = sortedDates.slice(0, 7); // Get last 7 days

    recentDates.forEach(dateKey => {
        const entry = userData.history[dateKey];
        const date = new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-800 transition duration-150';
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-300">${date}</td>
            <td class="px-4 py-3 text-sm text-red-300">${entry.workout || 0} mins</td>
            <td class="px-4 py-3 text-sm text-indigo-300">${(entry.sleep || 0).toFixed(1)} hrs</td>
            <td class="px-4 py-3 text-sm text-blue-300">${(entry.water || 0).toFixed(1)} L</td>
            <td class="px-4 py-3 text-sm text-green-300">${(entry.steps || 0).toLocaleString()}</td>
            <td class="px-4 py-3 text-sm text-yellow-300">${entry.diet > 0 ? 'Yes' : 'No'}</td>
            <td class="px-4 py-3 text-sm font-bold text-white bg-indigo-700">${entry.points || 0}</td>
        `;
        tableBody.appendChild(row);
    });
};

let pointsChart;
const renderPointsChart = () => {
    const ctx = document.getElementById('pointsChart').getContext('2d');
    const sortedDates = Object.keys(userData.history).sort();
    const recentDates = sortedDates.slice(-14); // Get last 14 days

    const labels = recentDates.map(dateKey => new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const data = recentDates.map(dateKey => userData.history[dateKey].points);

    if (pointsChart) {
        pointsChart.destroy(); // Destroy previous chart instance
    }

    pointsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Arete Points',
                data: data,
                borderColor: '#818cf8', // indigo-400
                backgroundColor: 'rgba(129, 140, 248, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#334155' }, // gray-700
                    ticks: { color: '#94a3b8' } // gray-400
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            },
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    });
};


// --- 4. MODAL & UI HELPERS ---

const showMessage = (text, isError = false) => {
    const box = document.getElementById('message-box');
    box.textContent = text;
    box.className = 'fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-2xl transition-opacity duration-500 text-white font-semibold';
    box.classList.add(isError ? 'bg-red-600' : 'bg-green-500');
    box.classList.remove('hidden');
    setTimeout(() => { box.classList.add('hidden'); }, 3500);
};

window.closeLogModal = () => { 
    document.getElementById('log-modal-overlay').style.display = 'none'; 
};

const openLogModal = (metricId) => {
    const details = METRIC_DETAILS[metricId];
    const modalBody = document.getElementById('modal-body');
    document.getElementById('modal-metric-id').value = metricId;
    document.getElementById('modal-title').innerHTML = `<i data-lucide="${details.icon}" class="w-8 h-8 mr-2 inline-block"></i> Log ${details.name}`;
    document.getElementById('modal-points-text').textContent = `+${details.points} pts`;
    
    const todayKey = getTodayDateKey();
    const todayEntry = userData.history[todayKey];

    if (metricId === 'diet') {
        const goalMet = todayEntry.diet > 0;
        document.getElementById('modal-goal-text').textContent = "Goal: Logged (Simplified)";
        modalBody.innerHTML = `
            <p class="text-xl font-medium text-gray-300 mb-4">Did you meet your healthy eating goal today?</p>
            <div class="p-4 rounded-lg border ${goalMet ? 'border-green-500 bg-green-900/50' : 'border-gray-700 bg-gray-900/50'} text-center">
                <p class="text-lg font-bold text-white">${goalMet ? 'Diet Goal Already Logged Today!' : 'Click Save to Log Diet Goal'}</p>
            </div>
            <input type="hidden" name="logValue" value="1">
        `;
    } else {
        const goal = userData.goals[metricId];
        const currentValue = todayEntry[metricId] || 0;
        document.getElementById('modal-goal-text').textContent = `${goal.toLocaleString()} ${details.unit}`;
        modalBody.innerHTML = `
            <label for="modal-input-value" class="block text-xl font-medium text-gray-300 mb-2">${details.name} Logged (Cumulative):</label>
            <div class="flex items-center space-x-3">
                <input type="${details.type}" id="modal-input-value" name="logValue" min="0" step="${details.step}" required value="${currentValue}"
                    class="form-input text-2xl p-4 text-center focus:ring-${details.color} focus:border-${details.color} transition duration-200">
                <span class="text-2xl font-semibold text-gray-400">${details.unit}</span>
            </div>
            <p class="text-sm text-gray-500 mt-2">Enter the cumulative total you achieved today.</p>
        `;
    }
    document.getElementById('log-modal-overlay').style.display = 'flex';
    lucide.createIcons();
}

const navigateTo = (targetId) => {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('animate-fade-in-up');
    });
    const targetPage = document.getElementById(targetId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('animate-fade-in-up');
    }
    // Call the correct render function for the target page
    if (targetId === 'dashboard') renderDashboard();
    else if (targetId === 'progress') renderProgress();
    else if (targetId === 'log') { renderGoalForm(); lucide.createIcons(); }
    
    // Update active state on navigation buttons (optional but good for UX)
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('text-gray-300', 'hover:bg-indigo-600', 'hover:text-white');
    });
    const activeBtn = document.querySelector(`.nav-link[data-target="${targetId}"]`);
    if(activeBtn) {
        activeBtn.classList.add('bg-indigo-600', 'text-white');
        activeBtn.classList.remove('text-gray-300', 'hover:bg-indigo-600', 'hover:text-white');
    }
};

// --- LOGOUT FUNCTION ---
window.logout = () => {
    localStorage.removeItem('areteUserId');
    localStorage.removeItem('areteUsername');
    window.location.href = 'home.html'; 
}


// --- 5. APP INIT ---

const initApp = () => {
    // 1. Event Listeners for Daily Metric Cards
    document.querySelectorAll('.metric-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const metricElement = e.currentTarget.closest('[data-metric]');
            if (metricElement) openLogModal(metricElement.dataset.metric);
        });
    });

    // 2. Form Submit Listeners
    document.getElementById('modal-log-form').addEventListener('submit', handleModalSubmit);
    document.getElementById('goal-form').addEventListener('submit', handleGoalSubmit);

    // 3. Navigation Listeners
    document.querySelectorAll('.nav-link').forEach(button => {
        button.addEventListener('click', (e) => navigateTo(e.currentTarget.dataset.target));
    });
    
    // 4. Logout Listener
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) logoutBtn.addEventListener('click', window.logout);

    // 5. Load data and render initial page
    loadData();
    navigateTo('dashboard');
};

window.onload = initApp;