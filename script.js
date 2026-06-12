// ==========================================
// 1. GLOBAL STATE & LOCAL STORAGE SAVING
// ==========================================
let state = {
    wizardName: "",
    house: "",
    character: "",
    galleons: 0,
    inventory: [], 
    timerSeconds: 1500, 
    timerInterval: null,
    isTimerRunning: false,
    isMusicPlaying: false
};

// Automatically run when the page opens to check for saved wizard data
window.onload = function() {
    loadSavedData();
};

// Save progress helper function
function saveDataToVault() {
    localStorage.setItem('hogwarts_wizardName', state.wizardName);
    localStorage.setItem('hogwarts_galleons', state.galleons);
    localStorage.setItem('hogwarts_inventory', JSON.stringify(state.inventory));
}

// Load data helper function
function loadSavedData() {
    let savedName = localStorage.getItem('hogwarts_wizardName');
    let savedGold = localStorage.getItem('hogwarts_galleons');
    let savedInventory = localStorage.getItem('hogwarts_inventory');

    if (savedName) {
        state.wizardName = savedName;
        state.galleons = parseInt(savedGold) || 0;
        state.inventory = savedInventory ? JSON.parse(savedInventory) : [];
        
        // Skip login screen directly to House Selection since they are already saved!
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('welcomeWizardName').innerText = state.wizardName;
        document.getElementById('houseMenu').classList.remove('hidden');
        
        // Sync UI counters
        document.getElementById('galleonCount').innerText = state.galleons;
        updateInventoryUI();
    }
}

// Start audio track on user first touch workaround
document.addEventListener('click', function() {
    if (!state.isMusicPlaying && state.wizardName !== "") {
        startAmbientMusic();
    }
}, { once: true });

// ==========================================
// 2. SIMULATION GOOGLE LOGIN MECHANISM
// ==========================================
function handleGoogleLogin() {
    let nameInput = prompt("Enter your Wizard or Google Account Name to link profile:");
    
    if (nameInput === null) return; // User pressed cancel
    if (nameInput.trim() === "") {
        alert("🪄 Please enter a valid name to authorize authentication!");
        return;
    }
    
    state.wizardName = nameInput.trim();
    state.galleons = 0;
    state.inventory = [];
    
    // Save brand new setup to memory
    saveDataToVault();
    
    // Animate to next display
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('welcomeWizardName').innerText = state.wizardName;
    document.getElementById('houseMenu').classList.remove('hidden');
    
    startAmbientMusic();
}

function handleLogout() {
    if (confirm("Are you sure you want to log out? Your saved chest items and Galleons will be wiped from this browser context.")) {
        clearInterval(state.timerInterval);
        localStorage.clear();
        location.reload(); // Reloads page back to completely blank setup
    }
}

// ==========================================
// 3. SELECTION MENUS LOGIC
// ==========================================
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
    
    // Customize page header to greet user specifically
    document.getElementById('dashboardTitle').innerText = `${state.wizardName}'s Study Room`;
    
    document.getElementById('charMenu').classList.add('hidden');
    document.getElementById('mainDashboard').classList.remove('hidden');
}

// ==========================================
// 4. BACKGROUND MUSIC CONTROLS
// ==========================================
function startAmbientMusic() {
    const audio = document.getElementById('bgMusic');
    audio.play().then(() => {
        state.isMusicPlaying = true;
        const btn = document.getElementById('musicBtn');
        if (btn) btn.innerText = "🔊 Ambient: ON";
    }).catch(error => {
        console.log("Audio waiting for interaction authorization.");
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
// 5. DIAGON ALLEY SHOP LOGIC
// ==========================================
function toggleShop(isOpen) {
    const shopMenu = document.getElementById('shopMenu');
    if (isOpen) {
        document.getElementById('shopGalleonCount').innerText = state.galleons;
        shopMenu.classList.remove('hidden');
    } else {
        shopMenu.classList.add('hidden');
    }
}

function buyItem(itemName, cost) {
    if (state.galleons < cost) {
        alert("❌ Alas! You do not have enough Galleons in your vault for this purchase.");
        return;
    }
    
    state.galleons -= cost;
    state.inventory.push(itemName);
    
    // Commit adjustments straight to memory store
    saveDataToVault();
    
    document.getElementById('galleonCount').innerText = state.galleons;
    document.getElementById('shopGalleonCount').innerText = state.galleons;
    updateInventoryUI();
    
    alert(`🛍️ Successfully purchased: ${itemName}! It has been saved into your Hogwarts trunk.`);
}

function updateInventoryUI() {
    const listDiv = document.getElementById('inventoryList');
    if (state.inventory.length === 0) {
        listDiv.innerText = "Your trunk is empty...";
        return;
    }
    listDiv.innerHTML = state.inventory.map(item => `<span class="inventory-tag">📦 ${item}</span>`).join('');
}

// ==========================================
// 6. ADJUSTABLE POMODORO TIMER LOGIC
// ==========================================
function toggleTimer() {
    const btn = document.getElementById('timerBtn');
    const inputsDiv = document.getElementById('timerInputs');
    
    if (state.isTimerRunning) {
        clearInterval(state.timerInterval);
        state.isTimerRunning = false;
        btn.innerText = "Cast Focus Spell";
        inputsDiv.classList.remove('hidden'); 
    } else {
        let hrs = parseInt(document.getElementById('inputHours').value) || 0;
        let mins = parseInt(document.getElementById('inputMinutes').value) || 0;
        let secs = parseInt(document.getElementById('inputSeconds').value) || 0;
        
        let totalSeconds = (hrs * 3600) + (mins * 60) + secs;
        
        // 5-minute requirement verification check (300 seconds)
        if (totalSeconds < 300) {
            alert("🪄 A true wizard requires deeper focus! Please set the study session to at least 5 minutes.");
            return;
        }
        
        let minutesStudied = Math.ceil(totalSeconds / 60);
        
        state.timerSeconds = totalSeconds;
        state.isTimerRunning = true;
        btn.innerText = "Muffle Countdown (Pause)";
        inputsDiv.classList.add('hidden'); 
        
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
                
                // Add currency rewards
                state.galleons += minutesStudied; 
                
                // Save updated gold counts immediately
                saveDataToVault();
                
                document.getElementById('galleonCount').innerText = state.galleons;
                alert(`🪄 Mischief Managed! You finished your focus session and earned ${minutesStudied} Galleons!`);
                
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
