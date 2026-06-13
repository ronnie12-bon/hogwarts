// =========================
// SAVE SYSTEM
// =========================

const STORAGE_KEY = "hogwartsFocusSave";

const DEFAULT_DATA = {

    level: 1,

    galleons: 0,

    housePoints: 0,

    studyMinutes: 0

};

// =========================
// LOAD SAVE
// =========================

function loadData() {

    const save =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!save) {

        return {
            ...DEFAULT_DATA
        };
    }

    try {

        return JSON.parse(save);

    } catch {

        return {
            ...DEFAULT_DATA
        };
    }
}

// =========================
// GAME DATA
// =========================

let data = loadData();

// =========================
// SAVE DATA
// =========================

function saveData() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );
}

// =========================
// RESET DATA
// =========================

function resetData() {

    localStorage.removeItem(
        STORAGE_KEY
    );

    location.reload();
}

// =========================
// UPDATE UI
// =========================

function updateUI() {

    document.getElementById("level").textContent =
        data.level;

    document.getElementById("galleons").textContent =
        data.galleons;

    document.getElementById("housePoints").textContent =
        data.housePoints;

    document.getElementById("studyMinutes").textContent =
        data.studyMinutes;
}

// =========================
// TEST STUDY SESSION
// =========================

document
.getElementById("startBtn")
.addEventListener("click", () => {

    data.studyMinutes += 25;

    data.housePoints += 10;

    data.galleons += 20;

    saveData();

    updateUI();

});

// =========================
// INITIAL LOAD
// =========================

updateUI();
document
.getElementById("resetBtn")
.addEventListener("click", () => {

    if (
        confirm(
            "Delete all progress?"
        )
    ) {

        resetData();
    }

});

// =========================
// TIMER
// =========================

let minutes = 25;
let seconds = 0;

let running = false;

let interval = null;

const timerElement =
document.getElementById("timer");

function updateTimer() {

    if (!timerElement)
        return;

    timerElement.textContent =

        String(minutes)
        .padStart(2,"0")

        +

        ":"

        +

        String(seconds)
        .padStart(2,"0");
}

function startTimer() {

    if (running)
        return;

    running = true;

    interval = setInterval(() => {

        if (
            minutes === 0 &&
            seconds === 0
        ) {

            clearInterval(interval);

            running = false;

            alert(
                "✨ Study Session Complete!"
            );

            return;
        }

        if (seconds === 0) {

            minutes--;

            seconds = 59;

        } else {

            seconds--;
        }

        updateTimer();

    },1000);
}

function pauseTimer() {

    running = false;

    clearInterval(interval);
}

function resetTimer() {

    pauseTimer();

    minutes = 25;

    seconds = 0;

    updateTimer();
}

updateTimer();

const startBtn =
document.getElementById("startTimer");

const pauseBtn =
document.getElementById("pauseTimer");

const resetBtn =
document.getElementById("resetTimer");

if(startBtn)
startBtn.addEventListener(
"click",
startTimer
);

if(pauseBtn)
pauseBtn.addEventListener(
"click",
pauseTimer
);

if(resetBtn)
resetBtn.addEventListener(
"click",
resetTimer
);
