let timeLeft = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let isBreakTime = false;
let timerId = null;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const toggleButton = document.getElementById('toggle-timer');
const resetButton = document.getElementById('reset');
const progressRing = document.querySelector('.progress-ring__circle-fg');
const FULL_DASH_ARRAY = 490.088; // 2 * π * 78
const workTab = document.querySelector('[data-interval="work"]');
const breakTab = document.querySelector('[data-interval="break"]');
const tabs = document.querySelectorAll('.tab-item');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    document.title = `${minutes}:${seconds} - ${isBreakTime ? 'Break' : 'Work'} Time`;

    // Update progress ring
    const totalTime = isBreakTime ? breakTime : (25 * 60);
    const progress = timeLeft / totalTime;
    const offset = FULL_DASH_ARRAY * progress;
    progressRing.style.strokeDashoffset = offset;
}

function toggleTimer() {
    if (timerId === null) {
        // Start timer
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                toggleButton.classList.remove('counting');
                
                // Toggle between work and break periods
                isBreakTime = !isBreakTime;
                timeLeft = isBreakTime ? breakTime : (25 * 60);
                
                // Update UI to show current session type
                const titleElement = document.querySelector('h1');
                titleElement.textContent = isBreakTime ? 'Timer' : 'Timer';
                
                // Update tabs
                workTab.classList.toggle('active', !isBreakTime);
                breakTab.classList.toggle('active', isBreakTime);
                
                // Show alert and update display
                alert(isBreakTime ? 'Time for a break!' : 'Break finished! Time to work!');
                updateDisplay();
                toggleButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        }, 1000);
        toggleButton.innerHTML = '<i class="fas fa-pause"></i>';
        toggleButton.classList.add('counting');
    } else {
        // Pause timer
        clearInterval(timerId);
        timerId = null;
        toggleButton.innerHTML = '<i class="fas fa-play"></i>';
        toggleButton.classList.remove('counting');
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isBreakTime = false;
    timeLeft = 25 * 60;
    breakTime = 5 * 60; // Reset break time too
    document.querySelector('h1').textContent = '🍅Timer';
    progressRing.style.strokeDashoffset = FULL_DASH_ARRAY; // Reset progress ring
    updateDisplay();
    toggleButton.innerHTML = '<i class="fas fa-play"></i>';
    toggleButton.classList.remove('counting');
    workTab.classList.add('active');
    breakTab.classList.remove('active');
}

function handleTabClick(e) {
    const clickedTab = e.target;
    const isWorkTab = clickedTab.dataset.interval === 'work';
    
    // Only switch if clicking inactive tab
    if ((isWorkTab && isBreakTime) || (!isWorkTab && !isBreakTime)) {
        // Clear existing timer
        clearInterval(timerId);
        timerId = null;
        
        // Switch modes
        isBreakTime = !isWorkTab;
        timeLeft = isBreakTime ? breakTime : (25 * 60);
        
        // Update UI
        workTab.classList.toggle('active', isWorkTab);
        breakTab.classList.toggle('active', !isWorkTab);
        
        // Reset play button
        toggleButton.innerHTML = '<i class="fas fa-play"></i>';
        
        // Update display
        updateDisplay();
    }
    toggleButton.classList.remove('counting');
}

toggleButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);

// Add event listeners to tabs
tabs.forEach(tab => {
    tab.addEventListener('click', handleTabClick);
});

// Initialize display
updateDisplay(); 