//// DOM ELEMENTS SELECTION
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const totalTaskElement = document.getElementById('total-tasks');
const completedTask = document.getElementById('completed-tasks');
const pendingTask = document.getElementById('pending-tasks');
const filterButtons = document.querySelectorAll('.filter-btn');

//// TASK DATA STORAGE
let tasks = [];
let taskIdCounter = 1;
let currentFilter = 'all';

/// EVENT: ADD TASK ON BUTTON CLICK
addBtn.addEventListener('click', addTask);

/// EVENT: ADD TASK ON ENTER KEY
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

//// INPUT VALIDATION (disable add button if empty)
taskInput.addEventListener('input', function() {
    addBtn.disabled = this.value.trim() === "";
});

//// FILTER BUTTONS CLICK
filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderTask();
    });
});

/// ADD TASK FUNCTION
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task');
        return;
    }

    const task = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        createdAt: new Date()
    };

    tasks.push(task);

    taskInput.value = "";
    addBtn.disabled = true;

    renderTask();
    updateStats();
}

/// TOGGLE TASK COMPLETE
function toggleTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTask();
        updateStats();
    }
}

/// DELETE TASK
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTask();
        updateStats();
    }
}

/// RENDER TASK LIST
function renderTask() {
    taskList.innerHTML = '';

    let filteredTask = tasks;
    if (currentFilter === 'completed') {
        filteredTask = tasks.filter(task => task.completed);
    } else if (currentFilter === 'pending') {
        filteredTask = tasks.filter(task => !task.completed);
    }

    if (filteredTask.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    filteredTask.forEach(task => {
        taskList.appendChild(createTask(task));
    });
}

/// CREATE TASK ELEMENT
function createTask(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-task-id', task.id);

    li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})">
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="btn delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;

    return li;
}

/// UPDATE STATS
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalTaskElement.textContent = total;
    completedTask.textContent = completed;
    pendingTask.textContent = pending;
}

/// INIT APP
function init() {
    addBtn.disabled = true;
    renderTask();
    updateStats();
}
init();
