// 포모도로 타이머 관련 변수 설정
const FOCUS_TIME = 25 * 60; // 25분 (초 단위)
const BREAK_TIME = 5 * 60;  // 5분 (초 단위)

let timeLeft = FOCUS_TIME;
let timerId = null;
let isFocusMode = true;
let pomodoroCount = 0;

// DOM 요소 가져오기
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeFocusBtn = document.getElementById('mode-focus');
const modeBreakBtn = document.getElementById('mode-break');
const pomodoroCountSpan = document.getElementById('pomodoro-count');

// 화면에 남은 시간(분:초) 업데이트하는 함수
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    // 두 자리 숫자로 맞추기 (예: 05:09)
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

// 타이머 시작 함수
function startTimer() {
    if (timerId !== null) return; // 이미 실행 중이면 중복 실행 방지

    timerId = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        // 시간이 다 되었을 때
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;

            if (isFocusMode) {
                pomodoroCount++;
                pomodoroCountSpan.textContent = pomodoroCount;
                alert('25분 집중 시간이 끝났습니다! 5분간 휴식하세요.');
                switchMode(false); // 휴식 모드로 자동 전환
            } else {
                alert('5분 휴식 시간이 끝났습니다! 다시 집중해볼까요?');
                switchMode(true);  // 집중 모드로 자동 전환
            }
        }
    }, 1000);
}

// 타이머 일시정지 함수
function pauseTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

// 타이머 초기화 함수
function resetTimer() {
    pauseTimer();
    timeLeft = isFocusMode ? FOCUS_TIME : BREAK_TIME;
    updateTimerDisplay();
}

// 집중 모드 / 휴식 모드 전환 함수
function switchMode(focusMode) {
    pauseTimer();
    isFocusMode = focusMode;

    if (isFocusMode) {
        timeLeft = FOCUS_TIME;
        modeFocusBtn.classList.add('active');
        modeBreakBtn.classList.remove('active');
        timerDisplay.style.color = '#d95550';
    } else {
        timeLeft = BREAK_TIME;
        modeBreakBtn.classList.add('active');
        modeFocusBtn.classList.remove('active');
        timerDisplay.style.color = '#4a90e2';
    }

    updateTimerDisplay();
}

// 버튼 클릭 이벤트 연결
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

modeFocusBtn.addEventListener('click', () => switchMode(true));
modeBreakBtn.addEventListener('click', () => switchMode(false));

// 초기 화면 표시
updateTimerDisplay();