// Global State Object to track user's data
let state = {
    house: "",
    character: "",
    galleons: 0,
    timerSeconds: 1500, // 25 minutes standard default
    timerInterval: null,
    isTimerRunning: false
};

// 1. Handle House Selection
function selectHouse(houseName) {
    state.house = houseName;
    document.getElementById('displayHouse').innerText = houseName;
    
    // Style the text color based on the chosen house
    const houseDisplay = document.getElementById('displayHouse');
    if(houseName === 'Gryffindor') houseDisplay.style.color = '#740001';
    if(houseName === 'Ravenclaw') houseDisplay.style.color = '#222f5b';
    if(houseName === 'Hufflepuff') houseDisplay.style.color = '#ecb939';
    if(houseName === 'Slytherin') houseDisplay.style.color = '#2a623d';

    // Move to next step: hide house menu, reveal character menu
    document.getElementById('houseMenu').classList.add('hidden');
    document.getElementById('charMenu').classList.remove('hidden');
}

// 2. Handle Character Selection
function selectCharacter(charName) {
    state.character = charName;
    document.getElementById('displayCharacter').innerText = charName;

    // Hide character menu, reveal main workspace
    document.getElementById('charMenu').classList.add('hidden');
    document.getElementById('mainDashboard').classList.remove('hidden');
}

// 3. Timer Control Logic
function toggleTimer() {
    const btn = document.getElementById('timerBtn');
    
    if (state.isTimerRunning) {
        // Pause execution
        clearInterval(state.timerInterval);
        state.isTimerRunning = false;
        btn.innerText = "Cast Focus Spell";
    } else {
        // Start countdown execution
        state.isTimerRunning = true;
        btn.innerText = "Muffle Countdown (Pause)";
        
        state.timerInterval = setInterval(() => {
            if (state.timerSeconds > 0) {
                state.timerSeconds--;
                updateTimerDisplay();
            } else {
                // Focus complete!
                clearInterval(state.timerInterval);
                state.isTimerRunning = false;
                btn.innerText = "Cast Focus Spell";
                
                // Reward System: 1 hour (3600s) = 100 Galleons. 
                // So, 25 mins (1500s) award roughly 42 Galleons!
                state.galleons += 42; 
                document.getElementById('galleonCount').innerText = state.galleons;
                
                alert("🪄 Mischief Managed! You finished your focus session and earned 42 Galleons!");
                
                state.timerSeconds = 1500; // Reset countdown standard length
                updateTimerDisplay();
            }
        }, 1000);
    }
}

// Helper to format countdown visuals correctly (MM:SS)
function updateTimerDisplay() {
    let minutes = Math.floor(state.timerSeconds / 60);
    let seconds = state.timerSeconds % 60;
    
    // Pad single digits with a zero (e.g., 5 becomes 05)
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    
    document.getElementById('timerDisplay').innerText = `${formattedMinutes}:${formattedSeconds}`;
}
