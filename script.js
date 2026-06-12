let state = {
    house: "",
    character: "",
    galleons: 0,
    timerSeconds: 1500, 
    timerInterval: null,
    isTimerRunning: false,
    isMusicPlaying: false
};

// Start music automatically on the very first click anywhere on screen
document.addEventListener('click', function() {
    if (!state.isMusicPlaying) {
        startAmbientMusic();
    }
}, { once: true });

function selectHouse(houseName) {
    state.house = houseName;
    document.getElementById('displayHouse').innerText = houseName;
    
    const houseDisplay = document.getElementById('displayHouse');
    if(houseName === 'Gryffindor') houseDisplay.style.color = '#ffc500'; 
    if(houseName === 'Ravenclaw') houseDisplay.style.color = '#00aae4';  
    if(houseName === 'Hufflepuff') houseDisplay.style.color = '#ecb939'; 
    if(houseName === 'Slytherin') houseDisplay.style.color = '#2a623d';  

    document.getElementById('houseMenu').classList.add('hidden');
    document.getElementById('charMenu').classList.remove('hidden');
    startAmbientMusic();
}

function selectCharacter(charName) {
    state.character = charName;
    document.getElementById('displayCharacter').innerText = charName;
    document.getElementById('charMenu').classList.add('hidden');
    document.getElementById('mainDashboard').classList.remove('hidden');
}

function startAmbientMusic() {
    const audio = document.getElementById('bgMusic');
    audio.play().then(() => {
        state.isMusicPlaying = true;
        const btn = document.getElementById('musicBtn');
        if (btn) btn.innerText = "🔊 Ambient: ON";
    }).catch(error => {
        console.log("Audio waiting for user click.");
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

// Adjustable Timer Control Logic
function toggleTimer() {
    const btn = document.getElementById('timerBtn');
    const inputsDiv = document.getElementById('timerInputs');
    
    if (state.isTimerRunning) {
        // Pause the timer
        clearInterval(state.timerInterval);
        state.isTimerRunning = false;
        btn.innerText = "Cast Focus Spell";
        inputsDiv.classList.remove('hidden'); // Show hours/mins adjusters again
    } else {
        // Start the timer
        let hrs = parseInt(document.getElementById('inputHours').value) || 0;
        let mins = parseInt(document.getElementById('inputMinutes').value) || 0;
        let secs = parseInt(document.getElementById('inputSeconds').value) || 0;
        
        // Calculate total seconds from user input
        let totalSeconds = (hrs * 3600) + (mins * 60) + secs;
        
        // 5-minute restriction mechanism (300 seconds)
        if (totalSeconds < 300) {
            alert("🪄 A true wizard requires deeper focus! Please set the study session to at least 5 minutes.");
            return;
        }
        
        state.timerSeconds = totalSeconds;
        state.isTimerRunning = true;
        btn.innerText = "Muffle Countdown (Pause)";
        inputsDiv.classList.add('hidden'); // Hide entry blocks during study session
        
        updateTimerDisplay();

        state.timerInterval = setInterval(() => {
            if (state.timerSeconds > 0) {
                state.timerSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(state.timerInterval);
                state.isTimerRunning = false;
                btn.innerText = "Cast Focus Spell";
                inputsDiv.classList.remove('hidden');
                
                state.galleons += 42; 
                document.getElementById('galleonCount').innerText = state.galleons;
                
                alert("🪄 Mischief Managed! You finished your focus session and earned 42 Galleons!");
                
                // Reset inputs back to default values
                document.getElementById('inputHours').value = 0;
                document.getElementById('inputMinutes').value = 25;
                document.getElementById('inputSeconds').value = 0;
                document.getElementById('timerDisplay').innerText = "00:25:00";
            }
        }, 1000);
    }
}

function updateTimerDisplay() {
    let hours = Math.floor(state.timerSeconds / 3600);
    let minutes = Math.floor((state.timerSeconds % 3600) / 60);
    let seconds = state.timerSeconds % 60;
    
    let fHours = hours < 10 ? "0" + hours : hours;
    let fMinutes = minutes < 10 ? "0" + minutes : minutes;
    let fSeconds = seconds < 10 ? "0" + seconds : seconds;
    
    document.getElementById('timerDisplay').innerText = `${fHours}:${fMinutes}:${fSeconds}`;
}
  

                
      
