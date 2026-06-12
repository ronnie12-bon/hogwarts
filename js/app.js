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

function addBoostedXP(10); 

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
// =====================================================
// PART 4
// SHOP + INVENTORY + RARITY SYSTEM
// =====================================================

// -------------------------------------
// INVENTORY SAFETY
// -------------------------------------

if (!data.inventory) {
    data.inventory = [];
}

// -------------------------------------
// ITEM DATABASE
// -------------------------------------

const SHOP_ITEMS = [

    // =====================
    // SNACKS
    // =====================

    {
        id: "chocolate_frog",
        name: "Chocolate Frog",
        price: 20,
        rarity: "Common",
        category: "Snack"
    },

    {
        id: "bertie_beans",
        name: "Bertie Bott's Beans",
        price: 30,
        rarity: "Common",
        category: "Snack"
    },

    {
        id: "cauldron_cake",
        name: "Cauldron Cake",
        price: 50,
        rarity: "Common",
        category: "Snack"
    },

    {
        id: "treacle_tart",
        name: "Treacle Tart",
        price: 75,
        rarity: "Rare",
        category: "Snack"
    },

    {
        id: "sugar_quill",
        name: "Sugar Quill",
        price: 100,
        rarity: "Rare",
        category: "Snack"
    },

    // =====================
    // WANDS
    // =====================

    {
        id: "oak_wand",
        name: "Oak Wand",
        price: 1000,
        rarity: "Rare",
        category: "Wand"
    },

    {
        id: "cherry_wand",
        name: "Cherry Wand",
        price: 1200,
        rarity: "Rare",
        category: "Wand"
    },

    {
        id: "phoenix_wand",
        name: "Phoenix Core Wand",
        price: 2500,
        rarity: "Epic",
        category: "Wand"
    },

    {
        id: "elder_replica",
        name: "Elder Wand Replica",
        price: 5000,
        rarity: "Legendary",
        category: "Wand"
    },

    // =====================
    // BROOMS
    // =====================

    {
        id: "cleansweep",
        name: "Cleansweep Seven",
        price: 1500,
        rarity: "Rare",
        category: "Broom"
    },

    {
        id: "nimbus2000",
        name: "Nimbus 2000",
        price: 3500,
        rarity: "Epic",
        category: "Broom"
    },

    {
        id: "firebolt",
        name: "Firebolt",
        price: 10000,
        rarity: "Legendary",
        category: "Broom"
    },

    // =====================
    // CREATURES
    // =====================

    {
        id: "snowy_owl",
        name: "Snowy Owl",
        price: 2500,
        rarity: "Rare",
        category: "Creature"
    },

    {
        id: "kneazle",
        name: "Kneazle",
        price: 5000,
        rarity: "Epic",
        category: "Creature"
    },

    {
        id: "phoenix",
        name: "Phoenix",
        price: 25000,
        rarity: "Legendary",
        category: "Creature"
    },

    // =====================
    // ARTIFACTS
    // =====================

    {
        id: "resurrection_stone",
        name: "Resurrection Stone",
        price: 50000,
        rarity: "Mythic",
        category: "Artifact"
    },

    {
        id: "time_turner",
        name: "Time Turner",
        price: 75000,
        rarity: "Mythic",
        category: "Artifact"
    },

    {
        id: "philosophers_stone",
        name: "Philosopher's Stone",
        price: 100000,
        rarity: "Mythic",
        category: "Artifact"
    }

];

// -------------------------------------
// FIND ITEM
// -------------------------------------

function getItem(itemId) {

    return SHOP_ITEMS.find(
        item => item.id === itemId
    );
}

// -------------------------------------
// OWNERSHIP CHECK
// -------------------------------------

function ownsItem(itemId) {

    return data.inventory.some(
        item => item.id === itemId
    );
}

// -------------------------------------
// BUY ITEM
// -------------------------------------

function buyItem(itemId) {

    const item =
        getItem(itemId);

    if (!item)
        return;

    if (
        ownsItem(itemId)
    ) {

        notify(
            "⚠ Already Owned"
        );

        return;
    }

    if (
        data.galleons <
        item.price
    ) {

        notify(
            "💰 Not Enough Galleons"
        );

        return;
    }

    data.galleons -=
        item.price;

    data.inventory.push({

        id: item.id,

        name: item.name,

        rarity: item.rarity,

        category: item.category,

        acquired:
            Date.now()
    });

    addXP(
        Math.floor(
            item.price / 20
        )
    );

    notify(
        "✨ Purchased<br>" +
        item.name
    );

    saveData();

    updateDashboard();

    runProgressChecks();
}

// -------------------------------------
// SELL ITEM
// -------------------------------------

function sellItem(itemId) {

    const index =
        data.inventory.findIndex(
            item =>
                item.id === itemId
        );

    if (
        index === -1
    ) return;

    const item =
        getItem(itemId);

    const value =
        Math.floor(
            item.price * 0.5
        );

    data.galleons += value;

    data.inventory.splice(
        index,
        1
    );

    notify(
        "💰 Sold<br>" +
        item.name +
        "<br>+" +
        value +
        " Galleons"
    );

    saveData();

    updateDashboard();
}

// -------------------------------------
// INVENTORY STATS
// -------------------------------------

function getInventoryValue() {

    let total = 0;

    data.inventory.forEach(
        owned => {

            const item =
                getItem(
                    owned.id
                );

            if (item) {

                total +=
                    item.price;
            }

        }
    );

    return total;
}

// -------------------------------------
// RARITY COUNTS
// -------------------------------------

function getRarityCounts() {

    const counts = {

        Common: 0,
        Rare: 0,
        Epic: 0,
        Legendary: 0,
        Mythic: 0
    };

    data.inventory.forEach(
        item => {

            if (
                counts[item.rarity]
                !== undefined
            ) {

                counts[
                    item.rarity
                ]++;
            }

        }
    );

    return counts;
}

// -------------------------------------
// COLLECTION %
/* ----------------------------------- */

function getCollectionPercent() {

    return Math.floor(

        (
            data.inventory.length
            /
            SHOP_ITEMS.length
        ) * 100

    );
}

// -------------------------------------
// RANDOM LOOT ITEM
// -------------------------------------

function awardRandomLoot() {

    const available =

        SHOP_ITEMS.filter(
            item =>
                !ownsItem(
                    item.id
                )
        );

    if (
        available.length === 0
    ) {

        notify(
            "🎉 Collection Complete!"
        );

        return;
    }

    const randomItem =

        available[
            Math.floor(
                Math.random()
                *
                available.length
            )
        ];

    data.inventory.push({

        id: randomItem.id,

        name: randomItem.name,

        rarity:
            randomItem.rarity,

        category:
            randomItem.category,

        acquired:
            Date.now()
    });

    notify(
        "🎁 Loot Found!<br>"
        +
        randomItem.name
    );

    saveData();
}

// -------------------------------------
// SHOP FILTERS
// -------------------------------------

function getItemsByCategory(
    category
) {

    return SHOP_ITEMS.filter(
        item =>
            item.category ===
            category
    );
}

// -------------------------------------
// GLOBAL ACCESS
// -------------------------------------

window.buyItem =
    buyItem;

window.sellItem =
    sellItem;

window.getInventoryValue =
    getInventoryValue;

window.getCollectionPercent =
    getCollectionPercent;

window.getRarityCounts =
    getRarityCounts;

window.awardRandomLoot =
    awardRandomLoot;
// =====================================================
// PART 5
// CHOCOLATE FROG CARDS
// PATRONUS
// MYSTERY BOXES
// GRINGOTTS BANK
// =====================================================

// -------------------------------------
// SAVE MIGRATION
// -------------------------------------

if (!data.chocolateCards)
    data.chocolateCards = [];

if (!data.bankBalance)
    data.bankBalance = 0;

if (!data.patronus)
    data.patronus = null;

if (!data.lastInterestDate)
    data.lastInterestDate = null;

// -------------------------------------
// CHOCOLATE FROG CARDS
// -------------------------------------

const CHOCOLATE_FROG_CARDS = [

    {
        name: "Albus Dumbledore",
        rarity: "Legendary"
    },

    {
        name: "Minerva McGonagall",
        rarity: "Epic"
    },

    {
        name: "Severus Snape",
        rarity: "Epic"
    },

    {
        name: "Remus Lupin",
        rarity: "Rare"
    },

    {
        name: "Rubeus Hagrid",
        rarity: "Rare"
    },

    {
        name: "Sirius Black",
        rarity: "Epic"
    },

    {
        name: "Mad-Eye Moody",
        rarity: "Rare"
    },

    {
        name: "Newt Scamander",
        rarity: "Legendary"
    },

    {
        name: "Godric Gryffindor",
        rarity: "Mythic"
    },

    {
        name: "Rowena Ravenclaw",
        rarity: "Mythic"
    },

    {
        name: "Helga Hufflepuff",
        rarity: "Mythic"
    },

    {
        name: "Salazar Slytherin",
        rarity: "Mythic"
    }

];

// -------------------------------------
// OPEN CHOCOLATE FROG
// -------------------------------------

function openChocolateFrog() {

    const randomCard =

        CHOCOLATE_FROG_CARDS[
            Math.floor(
                Math.random()
                *
                CHOCOLATE_FROG_CARDS.length
            )
        ];

    const alreadyOwned =

        data.chocolateCards.some(
            card =>
                card.name ===
                randomCard.name
        );

    if (!alreadyOwned) {

        data.chocolateCards.push({

            ...randomCard,

            obtained:
                Date.now()

        });

        notify(
            "🎴 New Card!<br>"
            +
            randomCard.name
        );

    } else {

        data.galleons += 100;

        notify(
            "🎴 Duplicate Card<br>+100 Galleons"
        );
    }

    saveData();
}

// -------------------------------------
// CARD COLLECTION
// -------------------------------------

function getCardCollectionPercent() {

    return Math.floor(

        (
            data.chocolateCards.length
            /
            CHOCOLATE_FROG_CARDS.length
        ) * 100

    );
}

// -------------------------------------
// PATRONUS SYSTEM
// -------------------------------------

const PATRONUSES = [

    "Stag",
    "Otter",
    "Wolf",
    "Phoenix",
    "Falcon",
    "Horse",
    "Fox",
    "Doe",
    "Dragon",
    "Eagle",
    "Lion",
    "Tiger"

];

// -------------------------------------
// UNLOCK PATRONUS
// -------------------------------------

function unlockPatronus() {

    if (data.patronus)
        return;

    if (
        data.studyMinutes < 1000
    ) {

        notify(
            "✨ Study 1000 Minutes To Unlock Your Patronus"
        );

        return;
    }

    data.patronus =

        PATRONUSES[
            Math.floor(
                Math.random()
                *
                PATRONUSES.length
            )
        ];

    notify(
        "✨ Patronus Unlocked!<br>"
        +
        data.patronus
    );

    saveData();
}

// -------------------------------------
// MYSTERY BOX SYSTEM
// -------------------------------------

function openMysteryBox() {

    if (
        data.mysteryBoxes <= 0
    ) {

        notify(
            "🎁 No Mystery Boxes"
        );

        return;
    }

    data.mysteryBoxes--;

    const roll =
        Math.random();

    // 50%

    if (roll < 0.50) {

        const gold =

            Math.floor(
                Math.random() * 500
            ) + 100;

        data.galleons += gold;

        notify(
            "💰 Mystery Reward<br>+" +
            gold +
            " Galleons"
        );
    }

    // 30%

    else if (roll < 0.80) {

        awardRandomLoot();

        return;
    }

    // 15%

    else if (roll < 0.95) {

        openChocolateFrog();

        return;
    }

    // 5%

    else {

        data.galleons += 5000;

        notify(
            "✨ JACKPOT!<br>5000 Galleons"
        );
    }

    saveData();
}

// -------------------------------------
// GRINGOTTS BANK
// -------------------------------------

function deposit(amount) {

    amount =
        Number(amount);

    if (
        isNaN(amount)
    ) return;

    if (
        amount <= 0
    ) return;

    if (
        data.galleons < amount
    ) {

        notify(
            "💰 Not Enough Galleons"
        );

        return;
    }

    data.galleons -= amount;

    data.bankBalance += amount;

    notify(
        "🏦 Deposited<br>"
        +
        amount +
        " Galleons"
    );

    saveData();

    updateDashboard();
}

// -------------------------------------
// WITHDRAW
// -------------------------------------

function withdraw(amount) {

    amount =
        Number(amount);

    if (
        isNaN(amount)
    ) return;

    if (
        amount <= 0
    ) return;

    if (
        data.bankBalance < amount
    ) {

        notify(
            "🏦 Insufficient Vault Funds"
        );

        return;
    }

    data.bankBalance -= amount;

    data.galleons += amount;

    notify(
        "🏦 Withdrawn<br>"
        +
        amount +
        " Galleons"
    );

    saveData();

    updateDashboard();
}

// -------------------------------------
// DAILY INTEREST
// -------------------------------------

function applyBankInterest() {

    const today =
        new Date().toDateString();

    if (
        data.lastInterestDate ===
        today
    ) {
        return;
    }

    if (
        data.bankBalance > 0
    ) {

        const interest =

            Math.floor(
                data.bankBalance * 0.01
            );

        data.bankBalance +=
            interest;

        notify(
            "🏦 Bank Interest<br>"
            +
            interest +
            " Galleons"
        );
    }

    data.lastInterestDate =
        today;

    saveData();
}

applyBankInterest();

// -------------------------------------
// DAILY LOGIN REWARD
// -------------------------------------

function claimDailyReward() {

    const today =
        new Date().toDateString();

    if (
        data.lastDailyReward ===
        today
    ) {

        notify(
            "📅 Daily Reward Already Claimed"
        );

        return;
    }

    const reward =

        100 +
        (data.level * 5);

    data.galleons += reward;

    data.lastDailyReward =
        today;

    notify(
        "🎁 Daily Reward<br>"
        +
        reward +
        " Galleons"
    );

    saveData();
}

// -------------------------------------
// SECRET REWARD
// -------------------------------------

function checkSecretReward() {

    if (

        data.chocolateCards.length >= 12 &&
        !data.secretCollectorReward

    ) {

        data.secretCollectorReward =
            true;

        data.galleons +=
            10000;

        notify(
            "🎴 Complete Card Collection!<br>+10000 Galleons"
        );

        saveData();
    }
}

// -------------------------------------
// GLOBAL ACCESS
// -------------------------------------

window.openChocolateFrog =
    openChocolateFrog;

window.openMysteryBox =
    openMysteryBox;

window.deposit =
    deposit;

window.withdraw =
    withdraw;

window.claimDailyReward =
    claimDailyReward;

window.unlockPatronus =
    unlockPatronus;

window.getCardCollectionPercent =
    getCardCollectionPercent;

// -------------------------------------
// INITIAL CHECK
// -------------------------------------

checkSecretReward();
// =====================================================
// PART 6
// HOUSE CUP + CHAMBER OF SECRETS
// =====================================================

// -------------------------------------
// HOUSE CUP
// -------------------------------------

if (!data.houseCupPoints)
    data.houseCupPoints = 0;

function awardHouseCupPoints(points) {

    data.houseCupPoints += points;

    saveData();
}

function getHouseCupRank() {

    const hp = data.houseCupPoints;

    if (hp < 1000)
        return "Student";

    if (hp < 5000)
        return "Prefect";

    if (hp < 10000)
        return "Head Student";

    if (hp < 25000)
        return "House Captain";

    if (hp < 50000)
        return "House Champion";

    return "House Cup Legend";
}

// -------------------------------------
// HOUSE POINT BONUS
// -------------------------------------

function convertHousePointsToCup() {

    const bonus =
        Math.floor(
            data.housePoints / 100
        );

    awardHouseCupPoints(
        bonus
    );
}

// -------------------------------------
// CHAMBER OF SECRETS
// -------------------------------------

function unlockChamber() {

    if (
        data.studyMinutes >= 5000 &&
        data.inventory.length >= 20
    ) {

        if (
            !data.chamberUnlocked
        ) {

            data.chamberUnlocked =
                true;

            notify(
                "🐍 Chamber Of Secrets Unlocked!"
            );

            data.galleons += 5000;

            saveData();
        }
    }
}

// -------------------------------------
// ENTER CHAMBER
// -------------------------------------

function enterChamber() {

    if (
        !data.chamberUnlocked
    ) {

        notify(
            "🔒 Chamber Locked"
        );

        return;
    }

    const reward =

        Math.floor(
            Math.random() * 2000
        ) + 500;

    data.galleons += reward;

    notify(
        "🐍 Chamber Treasure<br>+" +
        reward +
        " Galleons"
    );

    saveData();
}

// -------------------------------------
// DAILY RESET
// -------------------------------------

function resetDailyQuests() {

    const today =
        new Date().toDateString();

    if (
        data.lastDailyReset ===
        today
    ) {
        return;
    }

    data.lastDailyReset =
        today;

    if (
        Array.isArray(
            data.claimedRewards
        )
    ) {

        data.claimedRewards =

            data.claimedRewards.filter(
                reward =>
                    !reward.startsWith(
                        "daily_"
                    )
            );
    }

    saveData();
}

// -------------------------------------
// WEEKLY RESET
// -------------------------------------

function getWeekNumber() {

    const now =
        new Date();

    const firstDay =
        new Date(
            now.getFullYear(),
            0,
            1
        );

    return Math.ceil(

        (
            (
                now -
                firstDay
            ) /
            86400000
        ) / 7

    );
}

function resetWeeklyQuests() {

    const week =
        getWeekNumber();

    if (
        data.lastWeeklyReset ===
        week
    ) {
        return;
    }

    data.lastWeeklyReset =
        week;

    if (
        Array.isArray(
            data.claimedRewards
        )
    ) {

        data.claimedRewards =

            data.claimedRewards.filter(
                reward =>
                    !reward.startsWith(
                        "weekly_"
                    )
            );
    }

    saveData();
}

// -------------------------------------
// LEGENDARY ARTIFACT BONUSES
// -------------------------------------

function hasItem(itemId) {

    return data.inventory.some(
        item =>
            item.id === itemId
    );
}

function getStudyMultiplier() {

    let multiplier = 1;

    if (
        hasItem(
            "resurrection_stone"
        )
    ) {

        multiplier += 0.25;
    }

    if (
        hasItem(
            "time_turner"
        )
    ) {

        multiplier += 0.50;
    }

    if (
        hasItem(
            "philosophers_stone"
        )
    ) {

        multiplier += 1.00;
    }

    return multiplier;
}

// -------------------------------------
// BOOSTED XP
// -------------------------------------

function addBoostedXP(baseXP) {

    const xp = Math.floor(

        baseXP *
        getStudyMultiplier()

    );

    addXP(xp);
}

// -------------------------------------
// PRESTIGE SYSTEM
// -------------------------------------

if (!data.prestige)
    data.prestige = 0;

function canPrestige() {

    return data.level >= 100;
}

function prestige() {

    if (
        !canPrestige()
    ) {

        notify(
            "⭐ Reach Level 100 To Prestige"
        );

        return;
    }

    data.prestige++;

    data.level = 1;

    data.xp = 0;

    data.galleons +=
        50000;

    notify(
        "⭐ Prestige " +
        data.prestige +
        " Achieved!"
    );

    saveData();

    updateDashboard();
}

// -------------------------------------
// PRESTIGE BONUS
// -------------------------------------

function getPrestigeMultiplier() {

    return 1 +
        (
            data.prestige * 0.1
        );
}

// -------------------------------------
// ENDGAME REWARDS
// -------------------------------------

function checkEndgameRewards() {

    if (

        data.level >= 100 &&
        data.inventory.length >= 10 &&
        !data.endgameReward

    ) {

        data.endgameReward =
            true;

        data.galleons +=
            100000;

        notify(
            "🏆 Hogwarts Grandmaster<br>+100000 Galleons"
        );

        saveData();
    }
}

// -------------------------------------
// MASTER WIZARD
// -------------------------------------

function isMasterWizard() {

    return (

        data.level >= 100 &&
        data.chocolateCards.length >= 12 &&
        data.inventory.length >= 20 &&
        data.chamberUnlocked

    );
}

// -------------------------------------
// FINAL TITLE
// -------------------------------------

function getUltimateTitle() {

    if (
        isMasterWizard()
    ) {

        return "Master Of Hogwarts";
    }

    return getWizardTitle();
}

// -------------------------------------
// GLOBAL ACCESS
// -------------------------------------

window.enterChamber =
    enterChamber;

window.prestige =
    prestige;

window.getHouseCupRank =
    getHouseCupRank;

window.getUltimateTitle =
    getUltimateTitle;

// -------------------------------------
// INITIALIZATION
// -------------------------------------

resetDailyQuests();

resetWeeklyQuests();

unlockChamber();

checkEndgameRewards();

convertHousePointsToCup();
