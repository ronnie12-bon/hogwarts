// ===============================
// HOGWARTS FOCUS APP
// ===============================

const STORAGE_KEY = "hogwartsFocusData";

let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    galleons: 0,
    housePoints: 0,
    studyMinutes: 0,
    studyHours: 0,
    streak: 1,
    inventory: [],
    achievements: [],
    house: "Not Selected",
    notes: "",
    lastVisit: new Date().toDateString()
};

// ===============================
// SAVE SYSTEM
// ===============================

function saveData() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}

// ===============================
// DAILY STREAK
// ===============================

function checkDailyStreak() {

    const today = new Date().toDateString();

    if (data.lastVisit !== today) {

        const last = new Date(data.lastVisit);
        const current = new Date(today);

        const diff =
            (current - last) /
            (1000 * 60 * 60 * 24);

        if (diff === 1) {
            data.streak++;
        } else if (diff > 1) {
            data.streak = 1;
        }

        data.lastVisit = today;
        saveData();
    }
}

checkDailyStreak();

// ===============================
// ACCEPTANCE LETTER
// ===============================

const letterModal =
    document.getElementById("letterModal");

const enterBtn =
    document.getElementById("enterHogwarts");

if (enterBtn) {

    if (localStorage.getItem("letterSeen")) {
        letterModal.style.display = "none";
    }

    enterBtn.addEventListener("click", () => {

        localStorage.setItem(
            "letterSeen",
            "true"
        );

        letterModal.style.display = "none";
    });
}

// ===============================
// DASHBOARD
// ===============================

function updateDashboard() {

    const galleons =
        document.getElementById("galleons");

    const housePoints =
        document.getElementById("housePoints");

    const studyMinutes =
        document.getElementById("studyMinutes");

    const streak =
        document.getElementById("streak");

    const currentHouse =
        document.getElementById("currentHouse");

    if (galleons)
        galleons.textContent =
            data.galleons;

    if (housePoints)
        housePoints.textContent =
            data.housePoints;

    if (studyMinutes)
        studyMinutes.textContent =
            data.studyMinutes;

    if (streak)
        streak.textContent =
            data.streak + " Days";

    if (currentHouse)
        currentHouse.textContent =
            data.house;
}

updateDashboard();

// ===============================
// NOTES
// ===============================

const notes =
    document.getElementById("notes");

if (notes) {

    notes.value = data.notes || "";

    notes.addEventListener("input", () => {

        data.notes = notes.value;

        saveData();
    });
}

// ===============================
// TIMER
// ===============================

let timerMinutes = 25;
let timerSeconds = 0;

let timerInterval = null;

const timerDisplay =
    document.getElementById("timer");

const startBtn =
    document.getElementById("startTimer");

const pauseBtn =
    document.getElementById("pauseTimer");

const resetBtn =
    document.getElementById("resetTimer");

function updateTimerDisplay() {

    if (!timerDisplay) return;

    timerDisplay.textContent =
        String(timerMinutes).padStart(2, "0")
        + ":" +
        String(timerSeconds).padStart(2, "0");
}

updateTimerDisplay();

function rewardMinute() {

    data.galleons += 1;

    data.housePoints += 1;

    data.studyMinutes += 1;

    data.studyHours =
        Math.floor(
            data.studyMinutes / 60
        );

    checkAchievements();

    updateRank();

    saveData();

    updateDashboard();
}

function startTimer() {

    if (timerInterval) return;

    timerInterval =
        setInterval(() => {

            if (
                timerMinutes === 0 &&
                timerSeconds === 0
            ) {

                clearInterval(timerInterval);

                timerInterval = null;

                alert(
                    "✨ Focus Session Complete!"
                );

                return;
            }

            if (timerSeconds === 0) {

                rewardMinute();

                timerMinutes--;

                timerSeconds = 59;

            } else {

                timerSeconds--;
            }

            updateTimerDisplay();

        }, 1000);
}

function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;
}

function resetTimer() {

    pauseTimer();

    timerMinutes = 25;

    timerSeconds = 0;

    updateTimerDisplay();
}

if (startBtn)
    startBtn.addEventListener(
        "click",
        startTimer
    );

if (pauseBtn)
    pauseBtn.addEventListener(
        "click",
        pauseTimer
    );

if (resetBtn)
    resetBtn.addEventListener(
        "click",
        resetTimer
    );

// ===============================
// RANK SYSTEM
// ===============================

function updateRank() {

    const rank =
        document.getElementById("rank");

    const progress =
        document.getElementById("rankProgress");

    if (!rank || !progress) return;

    let title = "First Year";
    let width = 5;

    if (data.housePoints >= 100) {
        title = "Second Year";
        width = 15;
    }

    if (data.housePoints >= 500) {
        title = "Third Year";
        width = 30;
    }

    if (data.housePoints >= 1000) {
        title = "Fourth Year";
        width = 45;
    }

    if (data.housePoints >= 2500) {
        title = "Prefect";
        width = 60;
    }

    if (data.housePoints >= 5000) {
        title = "Head Student";
        width = 80;
    }

    if (data.housePoints >= 10000) {
        title = "Hogwarts Legend";
        width = 100;
    }

    rank.textContent = title;

    progress.style.width =
        width + "%";
}

updateRank();

// ===============================
// ACHIEVEMENTS
// ===============================

function unlockAchievement(name) {

    if (
        data.achievements.includes(name)
    ) return;

    data.achievements.push(name);

    alert(
        "🏆 Achievement Unlocked:\n" +
        name
    );

    saveData();
}

function checkAchievements() {

    if (data.studyMinutes >= 1)
        unlockAchievement(
            "First Study Session"
        );

    if (data.studyMinutes >= 60)
        unlockAchievement(
            "1 Hour Scholar"
        );

    if (data.studyMinutes >= 300)
        unlockAchievement(
            "5 Hour Wizard"
        );

    if (data.studyMinutes >= 1000)
        unlockAchievement(
            "Master of Focus"
        );

    if (data.galleons >= 100)
        unlockAchievement(
            "100 Galleons"
        );

    if (data.galleons >= 1000)
        unlockAchievement(
            "Gold Collector"
        );

    if (data.galleons >= 10000)
        unlockAchievement(
            "Wealthy Wizard"
        );
}

// ===============================
// PARTICLES
// ===============================

const particles =
    document.getElementById("particles");

if (particles) {

    for (let i = 0; i < 60; i++) {

        const p =
            document.createElement("div");

        p.classList.add("particle");

        p.style.left =
            Math.random() * 100 + "%";

        p.style.animationDuration =
            10 + Math.random() * 20 + "s";

        p.style.animationDelay =
            Math.random() * 10 + "s";

        particles.appendChild(p);
    }
}

// ===============================
// AUDIO CONTROLS
// ===============================

function setupAudio(
    buttonId,
    audioId
) {

    const button =
        document.getElementById(buttonId);

    const audio =
        document.getElementById(audioId);

    if (!button || !audio) return;

    button.addEventListener(
        "click",
        () => {

            if (audio.paused) {

                audio.play();

                button.textContent =
                    "Pause";

            } else {

                audio.pause();

                button.textContent =
                    "Play";
            }
        }
    );
}

setupAudio(
    "trainToggle",
    "trainAudio"
);

setupAudio(
    "rainToggle",
    "rainAudio"
);

setupAudio(
    "fireToggle",
    "fireAudio"
);

setupAudio(
    "owlToggle",
    "owlAudio"
);

// ===============================
// GLOBAL ACCESS
// ===============================

window.hogwartsData = data;
window.saveHogwartsData = saveData;

// ===============================
// FIRST LOAD
// ===============================

updateDashboard();
updateRank();
checkAchievements();
saveData();
