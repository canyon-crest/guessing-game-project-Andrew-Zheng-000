// Global Variables
let level, answer, score, playername, nameValue;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
date.textContent = time();


// Add event listeners
playBtn.addEventListener("click",play);
guessBtn.addEventListener("click",makeGuess);
playerName.addEventListener("click",enterName)
giveUp.addEventListener("click",giveUP)

function enterName(){
    nameValue = document.getElementById("name").value;
    nameValue = nameValue.charAt(0).toUpperCase() + nameValue.slice(1);
    welcome.textContent = "Hello " + nameValue + ", let us begin our game."
    playBtn.disabled = false;
    playerName.disabled = true;
}

function play(){
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

function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess)||userGuess < 1 || userGuess > level){
        msg.textContent = "Enter a VALID number from 1-" + level;
        return;
    }
    score++; // valid guess add 1 to score
    if (userGuess > answer){
        msg.textContent = userGuess + " is too high! Guess again " + nameValue;
    }
    else if (userGuess < answer){
        msg.textContent = userGuess +  " is too low! Guess again " + nameValue;
    }
    else{
        if(score == 1){
            msg.textContent = "WOW! Congrats " + nameValue + ", you guessed the number " + answer + " first try! Amazing! Press play to play again";
            updateScore();
            reset();
        }else{
            msg.textContent = "Congrats " + nameValue + "! You guessed the number " + answer + " in " + score + " tries! Press play to play again";
            updateScore();
            reset();
        }
    }
}

function reset(){
    guessBtn.disabled = true;
    guess.disabled = true;
    guess.value = "";
    playBtn.disabled = false;
    guess.placeholder = "";
    giveUp.disabled = true;
    for(let i=0; i<levelArr.length; i++){
            levelArr[i].disabled=false;
    }
}

function updateScore(){
    scoreArr.push({ score: score, name: nameValue });
    scoreArr.sort((a, b) => a.score - b.score);
    let lb = document.getElementsByName("leaderboard");
    wins.textContent = "Total wins: " + scoreArr.length;
    let sum = 0;
    for (let i = 0; i < scoreArr.length; i++) {
        sum += scoreArr[i].score;
        if (i < lb.length) {
            lb[i].textContent = scoreArr[i].score + "  " + scoreArr[i].name;
        }
    }
    let avg = sum / scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
}

function time(){
    let d = new Date();
    // concatenate a string with al the date info...
    return d;
}

function giveUP(){
    msg.textContent = "The answer was " + answer + ". You gave up you loser :( Try again " + nameValue;
    score = level;
    updateScore();
    reset();
}
