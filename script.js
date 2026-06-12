// Global State Object to track user's data
let state = {
    house: "",
    character: "",
    galleons: 0,
    timerSeconds: 1500, 
    timerInterval: null,
    isTimerRunning: false,
    isMusicPlaying: false
};

// 1. Handle House Selection
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
}

// 2. Handle Character Selection & Start Audio
function selectCharacter(charName) {
    state.character = charName;
    document.getElementById('displayCharacter').innerText = charName;

    document.getElementById('charMenu').classList.add('hidden');
    document.getElementById('mainDashboard').classList.remove('hidden');

    startAmbientMusic();
}

// Audio Control Functions
function startAmbientMusic() {
    const audio = document.getElementById('bgMusic');
    audio.play().then(() => {
        state.isMusicPlaying = true;
        document.getElementById('musicBtn').innerText = "🔊 Ambient: ON";
    }).catch(error => {
        console.log("Audio autoplay blocked by browser. Waiting for manual user click.");
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

// 3. Timer Control Logic
function toggleTimer() {
    const btn = document.getElementById('timerBtn');
    
    if (state.isTimerRunning) {
        clearInterval(state.timerInterval);
        state.isTimerRunning = false;
        btn.innerText = "Cast Focus Spell";
    } else {
        state.isTimerRunning = true;
        btn.innerText = "Muffle Countdown (Pause)";
        
        state.timerInterval = setInterval(() => {
            if (state.timerSeconds > 0) {
                state.timerSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(state.timerInterval);
                state.isTimerRunning = false;
                btn.innerText = "Cast Focus Spell";
                
                state.galleons += 42; 
                document.getElementById('galleonCount').innerText = state.galleons;
                
                alert("🪄 Mischief Managed! You finished your focus session and earned 42 Galleons!");
                
                state.timerSeconds = 1500; 
                updateTimerDisplay();
            }
        }, 1000);
    }
}

function updateTimerDisplay() {
    let minutes = Math.floor(state.timerSeconds / 60);
    let seconds = state.timerSeconds % 60;
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById('timerDisplay').innerText = `${formattedMinutes}:${formattedSeconds}`;
}
 
