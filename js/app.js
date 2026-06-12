// =====================================================
// HOGWARTS FOCUS RPG ENGINE
// PART 1
// Core Save System
// =====================================================

const STORAGE_KEY = "hogwartsFocusData";

// =====================================================
// DEFAULT SAVE
// =====================================================

const DEFAULT_DATA = {

    // Currency

    galleons: 0,
    bankBalance: 0,

    // Progress

    xp: 0,
    level: 1,

    housePoints: 0,

    studyMinutes: 0,
    studyHours: 0,

    streak: 1,

    // Player

    house: "Not Selected",

    patronus: null,

    // Collections

    inventory: [],
    achievements: [],
    chocolateCards: [],

    mysteryBoxes: 0,

    // Quests

    dailyQuestCompleted: false,
    weeklyQuestCompleted: false,

    // Notes

    notes: "",

    // Dates

    lastVisit: new Date().toDateString(),

    // Settings

    audioEnabled: true,

    // Secrets

    chamberUnlocked: false
};

// =====================================================
// LOAD SAVE
// =====================================================

function loadData() {

    const raw =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!raw) {

        return structuredClone(
            DEFAULT_DATA
        );
    }

    try {

        const parsed =
            JSON.parse(raw);

        return {

            ...DEFAULT_DATA,

            ...parsed

        };

    } catch {

        return structuredClone(
            DEFAULT_DATA
        );
    }
}

let data = loadData();

// =====================================================
// SAVE
// =====================================================

function saveData() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );
}

// =====================================================
// RESET
// =====================================================

function resetAllData() {

    localStorage.removeItem(
        STORAGE_KEY
    );

    localStorage.removeItem(
        "letterSeen"
    );

    location.reload();
}

// =====================================================
// DAILY STREAK
// =====================================================

function checkDailyStreak() {

    const today =
        new Date().toDateString();

    if (
        data.lastVisit === today
    ) {
        return;
    }

    const previous =
        new Date(
            data.lastVisit
        );

    const current =
        new Date(today);

    const difference =
        Math.floor(
            (current - previous)
            /
            (1000 * 60 * 60 * 24)
        );

    if (difference === 1) {

        data.streak++;

    } else {

        data.streak = 1;
    }

    data.lastVisit = today;

    saveData();
}

checkDailyStreak();

// =====================================================
// NOTIFICATIONS
// =====================================================

function notify(message) {

    const popup =
        document.createElement(
            "div"
        );

    popup.className =
        "magic-notification";

    popup.innerHTML =
        message;

    document.body.appendChild(
        popup
    );

    setTimeout(() => {

        popup.classList.add(
            "show"
        );

    }, 50);

    setTimeout(() => {

        popup.classList.remove(
            "show"
        );

        setTimeout(() => {

            popup.remove();

        }, 500);

    }, 3000);
}

// =====================================================
// XP SYSTEM
// =====================================================

function addXP(amount) {

    data.xp += amount;

    const oldLevel =
        data.level;

    calculateLevel();

    if (
        data.level > oldLevel
    ) {

        notify(
            "✨ Level Up!<br>Wizard Level "
            + data.level
        );

        data.galleons +=
            data.level * 25;
    }

    saveData();
}

// =====================================================
// LEVELS
// =====================================================

function calculateLevel() {

    data.level =
        Math.floor(
            data.xp / 100
        ) + 1;

    saveData();
}

calculateLevel();

// =====================================================
// HOUSE CUP RANK
// =====================================================

function getHouseRank() {

    const hp =
        data.housePoints;

    if (hp < 1000)
        return "First Year";

    if (hp < 2500)
        return "Second Year";

    if (hp < 5000)
        return "Third Year";

    if (hp < 10000)
        return "Prefect";

    if (hp < 25000)
        return "Head Student";

    return "Hogwarts Legend";
}

// =====================================================
// CHAMBER OF SECRETS
// =====================================================

function checkChamberUnlock() {

    if (
        data.studyMinutes >= 5000 &&
        data.inventory.length >= 20 &&
        !data.chamberUnlocked
    ) {

        data.chamberUnlocked =
            true;

        notify(
            "🐍 Chamber of Secrets Unlocked!"
        );

        saveData();
    }
}

// =====================================================
// HOUSE SYSTEM
// =====================================================

function setHouse(houseName) {

    data.house =
        houseName;

    saveData();

    notify(
        "🏰 Welcome to "
        + houseName
    );
}

// =====================================================
// DASHBOARD UPDATE
// =====================================================

function updateDashboard() {

    const galleons =
        document.getElementById(
            "galleons"
        );

    const housePoints =
        document.getElementById(
            "housePoints"
        );

    const studyMinutes =
        document.getElementById(
            "studyMinutes"
        );

    const streak =
        document.getElementById(
            "streak"
        );

    const currentHouse =
        document.getElementById(
            "currentHouse"
        );

    const level =
        document.getElementById(
            "wizardLevel"
        );

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

    if (level)
        level.textContent =
            data.level;
}

// =====================================================
// GLOBAL ACCESS
// =====================================================

window.hogwartsData = data;

window.saveHogwartsData =
    saveData;

window.resetAllData =
    resetAllData;

// =====================================================
// INITIALIZE
// =====================================================

updateDashboard();
checkChamberUnlock();

saveData();
// =====================================================
// PART 2
// TIMER ENGINE + STUDY REWARDS
// =====================================================

// -------------------------------------
// TIMER STATE
// -------------------------------------

let timerMinutes = 25;
let timerSeconds = 0;

let timerRunning = false;

let timerInterval = null;

// -------------------------------------
// ELEMENTS
// -------------------------------------

const timerDisplay =
    document.getElementById(
        "timer"
    );

const startButton =
    document.getElementById(
        "startTimer"
    );

const pauseButton =
    document.getElementById(
        "pauseTimer"
    );

const resetButton =
    document.getElementById(
        "resetTimer"
    );

// -------------------------------------
// UPDATE DISPLAY
// -------------------------------------

function updateTimerDisplay() {

    if (!timerDisplay)
        return;

    timerDisplay.textContent =
        String(timerMinutes)
            .padStart(2, "0")
        +
        ":"
        +
        String(timerSeconds)
            .padStart(2, "0");
}

updateTimerDisplay();

// -------------------------------------
// REWARD STUDY MINUTE
// -------------------------------------

function rewardMinute() {

    // Galleons

    data.galleons += 5;

    // House Points

    data.housePoints += 2;

    // Study Stats

    data.studyMinutes++;

    data.studyHours =
        Math.floor(
            data.studyMinutes / 60
        );

    // XP

    addXP(10);

    // Hourly Rewards

    if (
        data.studyMinutes % 60 === 0
    ) {

        data.mysteryBoxes++;

        notify(
            "🎁 Mystery Box Earned!"
        );
    }

    // Chamber Check

    checkChamberUnlock();

    updateDashboard();

    saveData();
}

// -------------------------------------
// SESSION COMPLETE
// -------------------------------------

function completeSession() {

    // Bonus rewards

    data.galleons += 50;

    data.housePoints += 25;

    addXP(50);

    notify(
        "✨ Focus Session Complete!"
    );

    updateDashboard();

    saveData();
}

// -------------------------------------
// START TIMER
// -------------------------------------

function startTimer() {

    if (timerRunning)
        return;

    timerRunning = true;

    timerInterval =
        setInterval(() => {

            if (
                timerMinutes === 0 &&
                timerSeconds === 0
            ) {

                clearInterval(
                    timerInterval
                );

                timerRunning =
                    false;

                completeSession();

                return;
            }

            if (
                timerSeconds === 0
            ) {

                timerMinutes--;

                timerSeconds = 59;

                rewardMinute();

            } else {

                timerSeconds--;
            }

            updateTimerDisplay();

        }, 1000);
}

// -------------------------------------
// PAUSE TIMER
// -------------------------------------

function pauseTimer() {

    timerRunning = false;

    clearInterval(
        timerInterval
    );
}

// -------------------------------------
// RESET TIMER
// -------------------------------------

function resetTimer() {

    pauseTimer();

    timerMinutes = 25;

    timerSeconds = 0;

    updateTimerDisplay();
}

// -------------------------------------
// CUSTOM TIMER
// -------------------------------------

function setTimer(minutes) {

    pauseTimer();

    timerMinutes = minutes;

    timerSeconds = 0;

    updateTimerDisplay();
}

// -------------------------------------
// BUTTON EVENTS
// -------------------------------------

if (startButton) {

    startButton.addEventListener(
        "click",
        startTimer
    );
}

if (pauseButton) {

    pauseButton.addEventListener(
        "click",
        pauseTimer
    );
}

if (resetButton) {

    resetButton.addEventListener(
        "click",
        resetTimer
    );
}

// -------------------------------------
// QUICK MODES
// -------------------------------------

window.startPomodoro =
function() {

    setTimer(25);

    startTimer();
};

window.startShortBreak =
function() {

    setTimer(5);

    startTimer();
};

window.startLongBreak =
function() {

    setTimer(15);

    startTimer();
};

// -------------------------------------
// STUDY SESSION HISTORY
// -------------------------------------

if (!data.studySessions) {

    data.studySessions = [];
}

function recordSession() {

    data.studySessions.push({

        date:
            new Date()
                .toLocaleDateString(),

        duration: 25,

        xp: 50,

        galleons: 50

    });

    saveData();
}

// -------------------------------------
// UPDATE COMPLETE SESSION
// -------------------------------------

const originalCompleteSession =
    completeSession;

completeSession =
function() {

    recordSession();

    data.galleons += 50;

    data.housePoints += 25;

    addXP(50);

    notify(
        "🏆 Session Complete<br>+50 Galleons<br>+50 XP"
    );

    updateDashboard();

    saveData();
};

// -------------------------------------
// AUTO SAVE
// -------------------------------------

setInterval(() => {

    saveData();

}, 30000);

// -------------------------------------
// INITIAL LOAD
// -------------------------------------

updateTimerDisplay();
updateDashboard();
// =====================================================
// PART 3
// ACHIEVEMENTS + QUESTS + TITLES
// =====================================================

// -------------------------------------
// INITIALIZE ARRAYS
// -------------------------------------

if (!data.achievements) {
    data.achievements = [];
}

if (!data.claimedRewards) {
    data.claimedRewards = [];
}

// -------------------------------------
// ACHIEVEMENT DEFINITIONS
// -------------------------------------

const ACHIEVEMENTS = [

    {
        id: "first_study",
        name: "First Study Session",
        description: "Study for 1 minute",
        reward: 25,
        condition: () =>
            data.studyMinutes >= 1
    },

    {
        id: "one_hour",
        name: "Apprentice Wizard",
        description: "Study for 60 minutes",
        reward: 100,
        condition: () =>
            data.studyMinutes >= 60
    },

    {
        id: "five_hours",
        name: "Dedicated Scholar",
        description: "Study for 300 minutes",
        reward: 300,
        condition: () =>
            data.studyMinutes >= 300
    },

    {
        id: "master_focus",
        name: "Master of Focus",
        description: "Study for 1000 minutes",
        reward: 1000,
        condition: () =>
            data.studyMinutes >= 1000
    },

    {
        id: "collector",
        name: "Collector",
        description: "Own 10 items",
        reward: 500,
        condition: () =>
            data.inventory.length >= 10
    },

    {
        id: "wealthy_wizard",
        name: "Wealthy Wizard",
        description: "Earn 5000 Galleons",
        reward: 1000,
        condition: () =>
            data.galleons >= 5000
    },

    {
        id: "legendary_wizard",
        name: "Legendary Wizard",
        description: "Reach Level 50",
        reward: 5000,
        condition: () =>
            data.level >= 50
    }

];

// -------------------------------------
// UNLOCK ACHIEVEMENT
// -------------------------------------

function unlockAchievement(id) {

    if (
        data.achievements.includes(id)
    ) {
        return;
    }

    const achievement =
        ACHIEVEMENTS.find(
            a => a.id === id
        );

    if (!achievement)
        return;

    data.achievements.push(id);

    data.galleons +=
        achievement.reward;

    notify(
        "🏆 Achievement Unlocked!<br>" +
        achievement.name +
        "<br>+" +
        achievement.reward +
        " Galleons"
    );

    saveData();
}

// -------------------------------------
// CHECK ACHIEVEMENTS
// -------------------------------------

function checkAchievements() {

    ACHIEVEMENTS.forEach(
        achievement => {

            if (
                achievement.condition()
            ) {

                unlockAchievement(
                    achievement.id
                );
            }

        }
    );
}

// -------------------------------------
// DAILY QUESTS
// -------------------------------------

const DAILY_QUESTS = [

    {
        id: "daily_30",
        name: "Study 30 Minutes",
        reward: 100,
        condition: () =>
            data.studyMinutes >= 30
    },

    {
        id: "daily_earn",
        name: "Earn 200 Galleons",
        reward: 100,
        condition: () =>
            data.galleons >= 200
    }

];

// -------------------------------------
// WEEKLY QUESTS
// -------------------------------------

const WEEKLY_QUESTS = [

    {
        id: "weekly_300",
        name: "Study 300 Minutes",
        reward: 1000,
        condition: () =>
            data.studyMinutes >= 300
    },

    {
        id: "weekly_level",
        name: "Reach Level 10",
        reward: 1000,
        condition: () =>
            data.level >= 10
    }

];

// -------------------------------------
// COMPLETE DAILY QUEST
// -------------------------------------

function completeDailyQuest(
    quest
) {

    const key =
        "daily_" + quest.id;

    if (
        data.claimedRewards.includes(
            key
        )
    ) {
        return;
    }

    data.claimedRewards.push(
        key
    );

    data.galleons +=
        quest.reward;

    notify(
        "📜 Daily Quest Complete!<br>" +
        quest.name +
        "<br>+" +
        quest.reward +
        " Galleons"
    );

    saveData();
}

// -------------------------------------
// COMPLETE WEEKLY QUEST
// -------------------------------------

function completeWeeklyQuest(
    quest
) {

    const key =
        "weekly_" + quest.id;

    if (
        data.claimedRewards.includes(
            key
        )
    ) {
        return;
    }

    data.claimedRewards.push(
        key
    );

    data.galleons +=
        quest.reward;

    notify(
        "🏆 Weekly Quest Complete!<br>" +
        quest.name +
        "<br>+" +
        quest.reward +
        " Galleons"
    );

    saveData();
}

// -------------------------------------
// CHECK DAILY QUESTS
// -------------------------------------

function checkDailyQuests() {

    DAILY_QUESTS.forEach(
        quest => {

            if (
                quest.condition()
            ) {

                completeDailyQuest(
                    quest
                );
            }

        }
    );
}

// -------------------------------------
// CHECK WEEKLY QUESTS
// -------------------------------------

function checkWeeklyQuests() {

    WEEKLY_QUESTS.forEach(
        quest => {

            if (
                quest.condition()
            ) {

                completeWeeklyQuest(
                    quest
                );
            }

        }
    );
}

// -------------------------------------
// STREAK REWARDS
// -------------------------------------

function checkStreakRewards() {

    if (
        data.streak === 7
    ) {

        data.galleons += 250;

        notify(
            "🔥 7 Day Streak!<br>+250 Galleons"
        );
    }

    if (
        data.streak === 30
    ) {

        data.galleons += 1000;

        notify(
            "🔥 30 Day Streak!<br>+1000 Galleons"
        );
    }

    saveData();
}

// -------------------------------------
// WIZARD TITLES
// -------------------------------------

function getWizardTitle() {

    const level =
        data.level;

    if (level < 5)
        return "First Year";

    if (level < 10)
        return "Second Year";

    if (level < 20)
        return "Third Year";

    if (level < 30)
        return "Prefect";

    if (level < 50)
        return "Head Student";

    if (level < 75)
        return "Auror";

    if (level < 100)
        return "Archmage";

    return "Master of Hogwarts";
}

// -------------------------------------
// UPDATE TITLE ELEMENT
// -------------------------------------

function updateWizardTitle() {

    const titleElement =
        document.getElementById(
            "wizardTitle"
        );

    if (
        titleElement
    ) {

        titleElement.textContent =
            getWizardTitle();
    }
}

// -------------------------------------
// GLOBAL QUEST CHECK
// -------------------------------------

function runProgressChecks() {

    checkAchievements();

    checkDailyQuests();

    checkWeeklyQuests();

    updateWizardTitle();

    saveData();
}

// -------------------------------------
// RUN ON LOAD
// -------------------------------------

runProgressChecks();
