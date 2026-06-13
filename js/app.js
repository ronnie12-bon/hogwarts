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
