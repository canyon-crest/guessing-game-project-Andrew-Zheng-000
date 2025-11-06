// Global Variables
let level, answer, score, playername, nameValue, elapsed, startTime;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
let date = "Date: ";
createDate();
// don't start the interval until the game actually starts
let timer = null;
let flag = true;
let start = new Date().getTime();
let running = false;

// Add event listeners
playBtn.addEventListener("click",play);
guessBtn.addEventListener("click",makeGuess);
playerName.addEventListener("click",enterName);
giveUp.addEventListener("click",giveUP);
resetName.addEventListener("click",resetname);

function enterName(){
    nameValue = document.getElementById("name").value;
    nameValue = nameValue.charAt(0).toUpperCase() + nameValue.slice(1);
    welcome.textContent = "Hello " + nameValue + ", let us begin our game."
    playBtn.disabled = false;
}

function resetname(){
    nameValue = "";
    document.getElementById("name").value = "";
    welcome.textContent = "WELCOME PLAYER";
    playBtn.disabled = true;
    reset();
}

function play(){
    if(!running){
        startTime = new Date().getTime(); // reset start time
        timer = setInterval(useTimer, 10);
        running = true;
    }
    score=0;//sets score to 0 every new game
    playBtn.disabled = true;
    guessBtn.disabled = false;
    giveUp.disabled = false;
    guess.disabled = false;
    
    for(let i=0; i<levelArr.length; i++){
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
        levelArr[i].disabled=true;
    }
    msg.textContent = "Guess a number from 1-" + level;
    answer = Math.floor(Math.random()*level+1);
    guess.placeholder = answer;
}

function useTimer(){
    let now = new Date().getTime();
    elapsed = (now - startTime) / 1000;
    document.getElementById("myTimer").innerHTML = elapsed.toFixed(2);
}

function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess)||userGuess < 1 || userGuess > level){
        msg.textContent = "Enter a VALID number from 1-" + level;
        return;
    }
    score++; // valid guess add 1 to score
    if (userGuess > answer){
        if (userGuess)
        msg.textContent = userGuess + " is too high. Your answer is " + close(Math.abs(answer - userGuess), answer) + ". Guess again " + nameValue;
    }
    else if (userGuess < answer){
        msg.textContent = userGuess +  " is too low. Your answer is " + close(Math.abs(answer - userGuess), answer) + ". Guess again " + nameValue;
    }
    else{
        if(score == 1){
            stopTimer();
            msg.textContent = "WOW! Congrats " + nameValue + ", you guessed the number " + answer + " first try in " + elapsed.toFixed(2) +" seconds! " + performance() + " Press play to play again";
            updateScore();
            reset();
        } else {
            stopTimer();
            msg.textContent = "Congrats " + nameValue + "! You guessed the number " + answer + " in " + score + " tries and " + elapsed.toFixed(2) +" seconds! " + performance() + " Press play to play again";
            updateScore();
            reset();
        }
    }
}

function updateClock(){
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;

        document.getElementById("myClock").innerHTML =
          "Time: " + hours + ":" + minutes + ":" + seconds;
    }

    setInterval(updateClock, 1000);
    createDate();
    updateClock(); 

function close(dist, Answer){
    if (dist <= Math.ceil(Answer / 20)) return "hot";
    else if (dist <= Math.ceil(Answer / 3)) return "warm";
    else return "cold";
}

function reset(){
    guessBtn.disabled = true;
    guess.disabled = true;
    guess.value = "";
    playBtn.disabled = false;
    guess.placeholder = "";
    giveUp.disabled = true;
    // ensure timer is stopped when resetting the UI
    stopTimer();
    for(let i=0; i<levelArr.length; i++){
            levelArr[i].disabled=false;
    }
}

function performance(){
    if (level == 3){
        if (score == 1){
            return "What luck!"
        }
        else if (score == 3){
            return "Seriously?"
        }
        else{
            return "Not bad."
        }
    }
    if (level == 10){
        if (score <= 3){
            return "Amazing!"
        }
        else if (score <= 6){
            return "Not bad."
        }
        else{
            return "Please try using your brain next time."
        }
    }
    if (level == 100){
        if (score <= 5){
            return "Incredible!"
        }
        else if (score <= 10){
            return "Pretty good."
        }
        else{
            return "You really are horrible at this..."
        }
    }
}

function updateScore(){
    let fastest;
    let scoreSum = 0;
    let timeSum = 0;
    scoreArr.push({ score: score, name: nameValue, time: elapsed });
    scoreArr.sort((a, b) => {
        if (a.score !== b.score) return a.score - b.score;
        const at = (typeof a.time === 'number') ? a.time : Number.POSITIVE_INFINITY;
        const bt = (typeof b.time === 'number') ? b.time : Number.POSITIVE_INFINITY;
        if (at !== bt) return at - bt;
        return (a.name || "").localeCompare(b.name || "");
    });
    let lb = document.getElementsByName("leaderboard");
    wins.textContent = "Total wins: " + scoreArr.length;
    for (let i = 0; i < scoreArr.length; i++) {
        scoreSum += scoreArr[i].score;
        timeSum += scoreArr[i].time;
        if (i < lb.length) {
            if (scoreArr[i].score == 1) {
                lb[i].textContent = scoreArr[i].score + " try by " + scoreArr[i].name + " at time " + scoreArr[i].time.toFixed(2) + " seconds";
            }
            else {
                lb[i].textContent = scoreArr[i].score + " tries by " + scoreArr[i].name + " at time " + scoreArr[i].time.toFixed(2) + " seconds";
            }
        }
        fastest = scoreArr[0].time;
        if (fastest > scoreArr[i].time) {
            fastest = scoreArr[i].time;
        }
    }
    let avgSum = scoreSum / scoreArr.length;
    let avgTimes = timeSum / scoreArr.length;
    fastestTime.textContent = "Fastest Time: " + fastest.toFixed(2) + " seconds";
    avgTime.textContent = "Average Time: " + avgTimes.toFixed(2) + " seconds";
    avgScore.textContent = "Average Score: " + avgSum.toFixed(2);
}


function giveUP(){
    msg.textContent = "The answer was " + answer + ". You gave up you loser :( Try again " + nameValue;
    score = level;
    stopTimer();
    updateScore();
    reset();
}


function createDate(){
    let d = new Date();
    let month = d.getMonth();
    let day = d.getDate();
    let year = d.getFullYear();
    let dow = d.getDay();
    switch(dow){
        case 0: dow ="Sunday"; break;
        case 1: dow = "Monday"; break;
        case 2: dow = "Tuesday"; break;
        case 3: dow = "Wednesday"; break;
        case 4: dow = "Thursday"; break;
        case 5: dow = "Friday"; break;
        case 6: dow = "Saturday"; break;
        default: console.error("ERROR");
    }
    switch(month){
        case 0: month ="January"; break;
        case 1: month = "February"; break;
        case 2: month = "March"; break;
        case 3: month = "April"; break;
        case 4: month = "May"; break;
        case 5: month = "June"; break;
        case 6: month = "July"; break;
        case 7: month ="August"; break;
        case 8: month = "September"; break;
        case 9: month = "October"; break;
        case 10: month = "November"; break;
        case 11: month = "December"; break;
        default: console.error("ERROR");
    }

    if (day == 1){
        day = day + "st";
    }
    else if (day == 2){
        day = day + "nd";
    }
    else if (day == 3){
        day = day + "rd";
    }
    else{
        day = day + "th";
    }

    date += dow + ", " + month + " " + day + "/" + year;
    document.getElementById("date").innerHTML = date;
}

function stopTimer(){
    if(running){
        clearInterval(timer);
        timer = null;
        running = false;
    }
}

