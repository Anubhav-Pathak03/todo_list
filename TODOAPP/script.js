document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const prioritySelect = document.getElementById('prioritySelect');
    const filterSelect = document.getElementById('filterSelect');

    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    filterSelect.addEventListener('change', filterTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (taskText === '') return;

        const task = { text: taskText, completed: false, priority: priority };
        saveTaskToLocalStorage(task);
        renderTasks();
        taskInput.value = '';
    }

    function saveTaskToLocalStorage(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        renderTasks();
    }

    function renderTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';

        const filter = filterSelect.value;

        tasks.forEach((task, index) => {
            if ((filter === 'Active' && task.completed) || (filter === 'Completed' && !task.completed)) {
                return;
            }

            const li = document.createElement('li');
            li.textContent = `${task.text} (Priority: ${task.priority})`;
            if (task.completed) {
                li.classList.add('completed');
            }

            const completeBtn = document.createElement('button');
            completeBtn.textContent = '✓';
            completeBtn.onclick = () => {
                task.completed = !task.completed;
                updateTaskInLocalStorage(tasks);
                renderTasks();
            };

            const editBtn = document.createElement('button');
            editBtn.textContent = '✎';
            editBtn.classList.add('edit');
            editBtn.onclick = () => editTask(index);

            const removeBtn = document.createElement('button');
            removeBtn.textContent = '✖';
            removeBtn.classList.add('remove');
            removeBtn.onclick = () => {
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
            };

            li.appendChild(completeBtn);
            li.appendChild(editBtn);
            li.appendChild(removeBtn);
            taskList.appendChild(li);
        });
    }

    function updateTaskInLocalStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function filterTasks() {
        renderTasks();
    }

    function editTask(index) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        taskInput.value = tasks[index].text;
        prioritySelect.value = tasks[index].priority;
        
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
});
