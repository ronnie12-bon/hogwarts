let time = 25 * 60;
let interval;

const timer = document.getElementById("timer");
const playBtn = document.getElementById("play");
const resetBtn = document.getElementById("reset");

function updateTimer() {

let minutes = Math.floor(time / 60);
let seconds = time % 60;

timer.innerText =
`${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

playBtn.addEventListener("click", () => {

if(interval) return;

interval = setInterval(() => {

if(time > 0){
time--;
updateTimer();
}
else{
clearInterval(interval);
}

},1000);

});

resetBtn.addEventListener("click",()=>{

clearInterval(interval);
interval=null;

time=25*60;

updateTimer();

});

updateTimer();

const audio = document.getElementById("audio");
const musicBtn = document.getElementById("musicBtn");

musicBtn.addEventListener("click",()=>{

if(audio.paused){

audio.play();
musicBtn.innerText="⏸ Pause Ambience";

}else{

audio.pause();
musicBtn.innerText="🎵 Play Ambience";

}

});
