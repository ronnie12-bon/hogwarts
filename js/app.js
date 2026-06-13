const data = {

level: 1,

galleons: 0,

housePoints: 0,

studyMinutes: 0

};

function updateUI(){

document.getElementById("level").textContent =
data.level;

document.getElementById("galleons").textContent =
data.galleons;

document.getElementById("housePoints").textContent =
data.housePoints;

document.getElementById("studyMinutes").textContent =
data.studyMinutes;

}

document
.getElementById("startBtn")
.addEventListener("click", () => {

data.studyMinutes += 25;

data.housePoints += 10;

data.galleons += 20;

updateUI();

alert("🚂 Study Session Started!");

});

updateUI();
