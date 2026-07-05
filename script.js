const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = document.querySelector('.tryAgain-btn');
const goHomeBtn = document.querySelector('.goHome-btn');
const nextBtn = document.querySelector('.next-btn');
const optionList = document.querySelector('.option-list');

let questionCount = 0;
let questionNumb = 1;
let userScore = 0;

// Pembolehubah untuk pemasa (Timer)
let timer; 
const timeLimit = 15; // 15 saat

startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
}

exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
}

continueBtn.onclick = () => {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('active');
    quizBox.classList.add('active');

    showQuestions(0);
    questionCounter(1);
    headerScore();
}

tryAgainBtn.onclick = () => {
    quizBox.classList.add('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
    showQuestions(questionCount);
    questionCounter(questionNumb);
    headerScore();
}

goHomeBtn.onclick = () => {
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
    showQuestions(questionCount);
    questionCounter(questionNumb);
}

nextBtn.onclick = () => {
    if (questionCount < questions.length - 1) {
        questionCount++;
        showQuestions(questionCount);

        questionNumb++;
        questionCounter(questionNumb);

        nextBtn.classList.remove('active');
    }
    else {
        showResultBox(false); // Tamat sebab habis semua soalan
    }
}

// Fungsi Papar Soalan + Mula Timer
function showQuestions(index) {
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;

    let optionTag = `<div class="option"><span>${questions[index].options[0]}</span></div>
        <div class="option"><span>${questions[index].options[1]}</span></div>
        <div class="option"><span>${questions[index].options[2]}</span></div>
        <div class="option"><span>${questions[index].options[3]}</span></div>`;

    optionList.innerHTML = optionTag;

    const option = document.querySelectorAll('.option');
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute('onclick', 'optionSelected(this)');
    }

    // Jalankan timer setiap kali soalan baru keluar
    startTimer(); 
}

// Fungsi untuk mengemas kini nombor soalan di bahagian bawah (Footer)
function questionCounter(index) {
    const questionTotal = document.querySelector('.quiz-footer .question-total');
    questionTotal.textContent = `Question ${index} of ${questions.length}`;
}

function optionSelected(answer) {
    clearInterval(timer); // Hentikan timer bila user dah jawab
    
    let userAnswer = answer.textContent;
    let correctAnswer = questions[questionCount].answer;
    let allOptions = optionList.children.length;
    
    if (userAnswer == correctAnswer) {
        answer.classList.add('correct');
        userScore += 1;
        headerScore();
    }
    else {
        answer.classList.add('incorrect');

        for(let i = 0; i < allOptions; i++) {
            if (optionList.children[i].textContent == correctAnswer) {
                optionList.children[i].setAttribute('class', 'option correct');
            }
        }
    }

    for(let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disabled');
    }

    nextBtn.classList.add('active');
}

// Fungsi Pemasa (Timer)
function startTimer() {
    let timeRemaining = timeLimit;
    
    // Set teks asal pada UI score
    updateTimerUI(timeRemaining);

    clearInterval(timer); // Padam sebarang timer sedia ada sebelum mulakan baru
    
    timer = setInterval(() => {
        timeRemaining--;
        updateTimerUI(timeRemaining);

        if (timeRemaining <= 0) {
            clearInterval(timer);
            timeOutAction(); // Panggil fungsi game over bila masa habis
        }
    }, 1000);
}

function updateTimerUI(seconds) {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.innerHTML = `Masa: <span style="color: #ff7597; font-weight:bold;">${seconds}s</span> | Score: ${userScore} / ${questions.length}`;
}

// Tindakan jika Masa Tamat
function timeOutAction() {
    let allOptions = optionList.children.length;
    for(let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disabled');
    }
    
    let correctAnswer = questions[questionCount].answer;
    for(let i = 0; i < allOptions; i++) {
        if (optionList.children[i].textContent == correctAnswer) {
            optionList.children[i].setAttribute('class', 'option correct');
        }
    }

    // Beri delay 1 saat sebelum keluar popup "Times Up"
    setTimeout(() => {
        showResultBox(true); // true bermaksud tamat sebab "Time's Up"
    }, 1000);
}

function updateTimerUI(seconds) {
    // Menyasar span pertama di dalam quiz-header (menggantikan "Made by: Fizika")
    const timerText = document.querySelector('.quiz-header span:first-child');
    timerText.innerHTML = `Masa: <span style="color: #ff7597; font-weight: bold;">${seconds}s</span>`;
}

function headerScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Score: ${userScore} / ${questions.length}`;
}

// Fungsi paparkan kotak keputusan / Times Up
function showResultBox(isTimesUp) {
    clearInterval(timer); // Pastikan timer berhenti
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    // DEKLARASI DI SINI SUPAYA KOD TAK CRASH:
    const resultTitle = resultBox.querySelector('h2');
    const scoreText = document.querySelector('.score-text');
    
    if (isTimesUp) {
        resultTitle.textContent = "Time's Up!";
        resultTitle.style.color = "#a60045"; 
        scoreText.textContent = `Game Over! ${questionCount} out of 30 questions answered.`;
    } else {
        resultTitle.textContent = "Quiz Result!";
        resultTitle.style.color = "#fff";
        scoreText.textContent = `You Score ${userScore} out of ${questions.length}`;
    }

    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');
    
    let progressStartValue = -1;
    let progressEndValue = Math.round((userScore / questions.length) * 100);
    let speed = 20;

    let progress = setInterval(() => {
        progressStartValue++;

        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(#c40094 ${progressStartValue * 3.6}deg, rgba(255, 255, 255, .1) 0deg)`;

        if (progressStartValue >= progressEndValue) {
            clearInterval(progress);
        }
    }, speed);
}