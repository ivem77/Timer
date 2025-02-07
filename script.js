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
                
                // Toggle between work and break periods
                isBreakTime = !isBreakTime;
                timeLeft = isBreakTime ? breakTime : (25 * 60);
                
                // Update UI to show current session type
                const titleElement = document.querySelector('h1');
                titleElement.textContent = isBreakTime ? 'Timer' : 'Timer';
                titleElement.classList.toggle('break', isBreakTime);
                
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
    } else {
        // Pause timer
        clearInterval(timerId);
        timerId = null;
        toggleButton.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isBreakTime = false;
    timeLeft = 25 * 60;
    document.querySelector('h1').textContent = 'Timer';
    document.querySelector('h1').classList.remove('break');
    progressRing.style.strokeDashoffset = FULL_DASH_ARRAY; // Reset progress ring
    updateDisplay();
    toggleButton.innerHTML = '<i class="fas fa-play"></i>';
    workTab.classList.add('active');
    breakTab.classList.remove('active');
}

toggleButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);

// Initialize display
updateDisplay(); 