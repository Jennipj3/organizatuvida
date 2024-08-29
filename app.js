document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const taskDateInput = document.getElementById('task-date');
    const taskTimeInput = document.getElementById('task-time');
    const taskList = document.getElementById('task-list');

    // Cargar las tareas desde el almacenamiento local al iniciar la página
    loadTasks();

    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && this.value !== '') {
            addTask(this.value, taskDateInput.value, taskTimeInput.value);
            this.value = '';
            taskDateInput.value = '';
            taskTimeInput.value = '';
        }
    });

    function addTask(task, date, time) {
        const li = document.createElement('li');

        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');
        taskContent.textContent = task;

        const taskDateTime = document.createElement('div');
        taskDateTime.classList.add('task-datetime');
        taskDateTime.textContent = `Fecha: ${date} Hora: ${time}`;

        li.appendChild(taskContent);
        li.appendChild(taskDateTime);

        const completeBtn = createCompleteBtn();
        const editBtn = createEditBtn();
        const deleteBtn = createDeleteBtn();

        li.appendChild(completeBtn);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        saveTaskToLocalStorage(task, date, time);
    }

    function editTask(li) {
        const currentText = li.querySelector('.task-content').textContent;
        const currentDate = li.querySelector('.task-datetime').textContent.split(' ')[1];
        const currentTime = li.querySelector('.task-datetime').textContent.split(' ')[3];

        const editTextarea = document.createElement('textarea');
        editTextarea.value = currentText;
        editTextarea.classList.add('edit-textarea');

        const editDateInput = document.createElement('input');
        editDateInput.type = 'date';
        editDateInput.value = currentDate;
        editDateInput.classList.add('edit-date-input');

        const editTimeInput = document.createElement('input');
        editTimeInput.type = 'time';
        editTimeInput.value = currentTime;
        editTimeInput.classList.add('edit-time-input');

        li.innerHTML = '';
        li.appendChild(editTextarea);
        li.appendChild(editDateInput);
        li.appendChild(editTimeInput);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Guardar';
        saveBtn.classList.add('save-btn');
        saveBtn.addEventListener('click', () => {
            if (editTextarea.value !== '') {
                li.textContent = editTextarea.value;

                const taskContent = document.createElement('div');
                taskContent.classList.add('task-content');
                taskContent.textContent = editTextarea.value;

                const taskDateTime = document.createElement('div');
                taskDateTime.classList.add('task-datetime');
                taskDateTime.textContent = `Fecha: ${editDateInput.value} Hora: ${editTimeInput.value}`;

                li.innerHTML = '';
                li.appendChild(taskContent);
                li.appendChild(taskDateTime);
                li.appendChild(createCompleteBtn());
                li.appendChild(createEditBtn());
                li.appendChild(createDeleteBtn());

                updateTaskInLocalStorage(currentText, editTextarea.value, editDateInput.value, editTimeInput.value);
            }
        });
        li.appendChild(saveBtn);
    }

    function createCompleteBtn() {
        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Completar';
        completeBtn.classList.add('complete-btn');
        completeBtn.addEventListener('click', (e) => {
            e.target.parentElement.classList.toggle('completed');
        });
        return completeBtn;
    }

    function createEditBtn() {
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', (e) => {
            editTask(e.target.parentElement);
        });
        return editBtn;
    }

    function createDeleteBtn() {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            const taskContent = e.target.parentElement.querySelector('.task-content').textContent;
            removeTaskFromLocalStorage(taskContent);
            taskList.removeChild(e.target.parentElement);
        });
        return deleteBtn;
    }

    function saveTaskToLocalStorage(task, date, time) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ task, date, time });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(({ task, date, time }) => {
            addTask(task, date, time);
        });
    }

    function updateTaskInLocalStorage(oldTask, newTask, newDate, newTime) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.findIndex(t => t.task === oldTask);
        if (taskIndex > -1) {
            tasks[taskIndex] = { task: newTask, date: newDate, time: newTime };
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function removeTaskFromLocalStorage(taskContent) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t.task !== taskContent);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});