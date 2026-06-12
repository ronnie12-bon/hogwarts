// ==========================================
// 1. GLOBAL APPLICATION STATE
// ==========================================
let state = {
    house: "",
    character: "",
    galleons: 0,
    timerSeconds: 1500, 
    timerInterval: null,
    isTimerRunning: false,
    isMusicPlaying: false
};

// MAGIC AUTOPLAY WORKAROUND: Browsers block music until a user clicks something.
// This listens for your very first click anywhere on screen and turns on the audio track.
document.addEventListener('click', function() {
    if (!state.isMusicPlaying) {
        startAmbientMusic();
    }
}, { once: true }); // '{ once: true }' makes sure this check stops running after the first click

// ==========================================
// 2. SELECTION MENUS LOGIC
// ==========================================
function selectHouse(houseName) {
    state.house = houseName;
    document.getElementById('displayHouse').innerText = houseName;
    
    // Dynamically change the house text color to look official
    const houseDisplay = document.getElementById('displayHouse');
    if(houseName === 'Gryffindor') houseDisplay.style.color = '#ffc500';  // Gold
    if(houseName === 'Ravenclaw') houseDisplay.style.color = '#00aae4';   // Blue
    if(houseName === 'Hufflepuff') houseDisplay.style.color = '#ecb939';  // Yellow
    if(houseName === 'Slytherin') houseDisplay.style.color = '#2a623d';   // Green

    // Slide over to the Character menu
    document.getElementById('houseMenu').classList.add('hidden');
    document.getElementById('charMenu').classList.remove('hidden');
    
    // Backup music starter
    startAmbientMusic();
}

function selectCharacter(charName) {
    state.character = charName;
    document.getElementById('displayCharacter').innerText = charName;
    
    // Open the main dashboard
    document.getElementById('charMenu').classList.add('hidden');
    document.getElementById('mainDashboard').classList.remove('hidden');
}

// ==========================================
// 3. BACKGROUND MUSIC CONTROLS
// ==========================================
function startAmbientMusic() {
    const audio = document.getElementById('bgMusic');
    audio.play().then(() => {
        state.isMusicPlaying = true;
        const btn = document.getElementById('musicBtn');
        if (btn) btn.innerText = "🔊 Ambient: ON";
    }).catch(error => {
        console.log("Audio waiting for user interaction to unlock.");
    });
}

function toggleMusic() {
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicBtn');
    
    if (state.isMusicPlaying) {
        audio.pause();
        state.isMusicPlaying = false;
        btn.innerText = "🔇 Ambient: OFF";
    } else {
        audio.play();
        state.isMusicPlaying = true;
        btn.innerText = "🔊 Ambient: ON";
    }
}

// ==========================================
// 4. ADJUSTABLE POMODORO TIMER LOGIC
// ==========================================
function toggleTimer() {
    const btn = document.getElementById('timerBtn');
    const inputsDiv = document.getElementById('timerInputs');
    
    if (state.isTimerRunning) {
        // PAUSE CURRENT TIMER
        clearInterval(state.timerInterval);
        state.isTimerRunning = false;
        btn.innerText = "Cast Focus Spell";
        inputsDiv.classList.remove('hidden'); // Show your adjustment boxes again
    } else {
        // START NEW TIMER
        let hrs = parseInt(document.getElementById('inputHours').value) || 0;
        let mins = parseInt(document.getElementById('inputMinutes').value) || 0;
        let secs = parseInt(document.getElementById('inputSeconds').value) || 0;
        
        // Convert all settings into absolute seconds for the machine
        let totalSeconds = (hrs * 3600) + (mins * 60) + secs;
        
        // SECURITY CHECK: Blocks anything under 5 minutes (300 seconds)
        if (totalSeconds < 300) {
            alert("🪄 A true wizard requires deeper focus! Please set the study session to at least 5 minutes.");
            return;
        }
        
        // ECONOMY MATH: Calculates 1 Galleon per minute (rounds up partial minutes)
        let minutesStudied = Math.ceil(totalSeconds / 60);
        
        state.timerSeconds = totalSeconds;
        state.isTimerRunning = true;
        btn.innerText = "Muffle Countdown (Pause)";
        inputsDiv.classList.add('hidden'); // Hide entry blocks during study session so it looks clean
        
        updateTimerDisplay();

        // Run countdown calculation every single second
        state.timerInterval = setInterval(() => {
            if (state.timerSeconds > 0) {
                state.timerSeconds--;
                updateTimerDisplay();
            } else {
                // TIMER FINISHED SUCCESSFULLY
                clearInterval(state.timerInterval);
                state.isTimerRunning = false;
                btn.innerText = "Cast Focus Spell";
                inputsDiv.classList.remove('hidden');
                
                // Add your calculated gold to vault balance
                state.galleons += minutesStudied; 
                document.getElementById('galleonCount').innerText = state.galleons;
                
                // Pop up victory alert message
                alert(`🪄 Mischief Managed! You finished your focus session and earned ${minutesStudied} Galleons!`);
                
                // Reset inputs back to original 25 mins layout
                document.getElementById('inputHours').value = 0;
                document.getElementById('inputMinutes').value = 25;
                document.getElementById('inputSeconds').value = 0;
                document.getElementById('timerDisplay').innerText = "00:25:00";
            }
        }, 1000);
    }
}

// Helper to convert raw numbers to clean HH:MM:SS text display
function updateTimerDisplay() {
    let hours = Math.floor(state.timerSeconds / 3600);
    let minutes = Math.floor((state.timerSeconds % 3600) / 60);
    let seconds = state.timerSeconds % 60;
    
    let fHours = hours < 10 ? "0" + hours : hours;
    let fMinutes = minutes < 10 ? "0" + minutes : minutes;
    let fSeconds = seconds < 10 ? "0" + seconds : seconds;
    
    document.getElementById('timerDisplay').innerText = `${fHours}:${fMinutes}:${fSeconds}`;
}
   
          


                
      
