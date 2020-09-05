'use strict';

const jangsize = 100;
//객체들이 field 사이즈 범위 넘어서 생성되지 않도록 해준다 

const jang_count = 10;
const sa_count = 10;
const GAME_DURATION_SEC = 10;
const field = document.querySelector('.game_field');
const fieldRect = field.getBoundingClientRect();
// field의 전체적인 사이즈와 포지션값을 확인할수 있다.
const gameBtn = document.querySelector('.game_button');
const gameTimer = document.querySelector('.game_timer');
const gameScore = document.querySelector('.game_score');
const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up_message');
const popUpRefresh = document.querySelector('.pop-up_refresh');
const jangSound = new Audio('sound/select.mp3');
const winSound = new Audio('sound/gang.mp3');

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', onFieldClick);

gameBtn.addEventListener('click', () => {
    if(started){
        stopGame();
    }else{
        startGame();
    }
});

popUpRefresh.addEventListener('click', () =>{
    startGame();
    hidePopUp();
});

function startGame(){
    started = true;
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
    stopSound(winSound);

}

function finishGame(win){
    started = false;
    hideGameButton();
    if(win){
        playsound(winSound);
    }
    stopGameTimer();
    showPopUpWithText(win? 'you won!':'you lost');
}

function stopGame(){
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('REPLAY?');
}


//================= 시간 타이머 설정 ========================
function startGameTimer(){
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(() =>{
        if(remainingTimeSec <=0){
            clearInterval(timer);
            finishGame(jang_count === score);
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000);
}

function stopGameTimer(){
    clearInterval(timer);
}

function updateTimerText(time){
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerText = `${minutes}:${seconds}`;
}

function showTimerAndScore(){
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}

//============================================================

function showPopUpWithText(text){
    popUpText.innerText = text;
    popUp.classList.remove('pop-up--hide');
}

function hidePopUp(){
    popUp.classList.add('pop-up--hide');
}

function showStopButton(){
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility = 'visible';
}

function hideGameButton(){
    gameBtn.style.visibility = 'hidden';
}

function initGame(){// 벌레와 당근을 생성한뒤 field에 추가해줌
    score =0;
    field.innerHTML= ''; //창에 요소 객체를 모두 감춤 
    gameScore.innerText = jang_count; //게임 시작시 jang의 갯수만큼 표시가 된다

    addItem('jang',jang_count,'img/jang.png');
    addItem('bug', sa_count,'img/sa.png');
}

function onFieldClick(event){
    if(!started){
        return;
    }
    const target = event.target;
    if(target.matches('.jang')){
        //당근!
        target.remove();
        score++;
        playsound(jangSound);
        updateScoreBoard();
        if(score === jang_count){
            finishGame(true);
        }
    }else if(target.matches('.bug')){
        //벌레!
        finishGame(false);
    }
}
function playsound(sound){
    sound.play();
}

function stopSound(sound){
    sound.pause();
}

function updateScoreBoard(){
    gameScore.innerText = jang_count - score;
}
function addItem(jang, count, imgPath){
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - jangsize;
    //객체들이 field 사이즈 범위 넘어서 생성되지 않도록 해준다 
    const y2 = fieldRect.height - jangsize;
    for(let i=0; i<count; i++){
        const item = document.createElement('img');
        item.setAttribute('class',jang);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max){
    return Math.random() * (max - min) + min;
}

