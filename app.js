//1. 포모도로 타이머 기능

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





// 2. 할 일(To-Do) 목록 관리 기능

let todos = [];

const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

// 할 일 목록을 화면에 그리는 함수
function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (todo.completed) {
            li.classList.add('completed');
        }

        // 체크박스와 텍스트 영역
        const leftDiv = document.createElement('div');
        leftDiv.className = 'todo-left';
        leftDiv.addEventListener('click', () => toggleTodo(index));

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;

        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text;

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(textSpan);

        // 삭제 버튼
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteTodo(index));

        li.appendChild(leftDiv);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// 새 할 일 추가 함수
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    todos.push({
        text: text,
        completed: false
    });

    todoInput.value = '';
    renderTodos();
}

// 할 일 완료 체크/해제 함수
function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}

// 할 일 삭제 함수
function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

// 추가 버튼 클릭 및 엔터키 이벤트 연결
addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});


// 3. 브라우저 로컬 스토리지(Local Storage) 연동
const STORAGE_KEY_TODOS = 'web_pomodoro_todos';
const STORAGE_KEY_COUNT = 'web_pomodoro_count';

// 데이터를 로컬 스토리지에 JSON 형태로 저장하는 함수
function saveData() {
    localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
    localStorage.setItem(STORAGE_KEY_COUNT, String(pomodoroCount));
}

// 페이지 로드 시 로컬 스토리지에서 데이터를 불러오는 함수
function loadData() {
    const savedTodos = localStorage.getItem(STORAGE_KEY_TODOS);
    const savedCount = localStorage.getItem(STORAGE_KEY_COUNT);

    if (savedTodos !== null) {
        todos = JSON.parse(savedTodos);
    }

    if (savedCount !== null) {
        pomodoroCount = parseInt(savedCount, 10) || 0;
        pomodoroCountSpan.textContent = pomodoroCount;
    }
}

// 초기 실행: 저장된 데이터 불러오기 및 화면 갱신
loadData();
updateTimerDisplay();
renderTodos();