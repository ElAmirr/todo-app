document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://jsonplaceholder.typicode.com/todos';
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const deleteBtn = document.getElementById('deleteDoneTaskBtn');
    const taskList = document.getElementById('taskList');
    let idCounter = 0;
    const tasks = []

    addTaskBtn.addEventListener('click', function () {
        const newTaskTitle = taskInput.value.trim();
        if (newTaskTitle !=='') {
            addTask(newTaskTitle);
            displayTask()
            taskInput.value = '';
        }
    });

    deleteBtn.addEventListener('click', function () {
        const activeTaskIds = tasks
        .filter(task => task.active)
        .map(activeTask => activeTask.id);
        console.log(activeTaskIds)
        deleteTask(activeTaskIds)
    })



    function addTask(newTaskTitle) {
        const newTask = { 
                            title: newTaskTitle,
                            active: false,
                            id: ++idCounter,
                        };                
        tasks.push(newTask);
        console.log('local data', tasks)
        addTaskOnServer(newTask);
    }

    function updateTask(task) {
        console.log(task.id)
        task.active = !task.active
        displayTask()
        console.log('updated', task)
        updateTaskOnServer(task)
    }


    function addTaskOnServer(newTask) {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: newTask.title,
                completed: false,
            }),
        })
        .then(response => response.json())
        .then(adedTask => {
            console.log(adedTask)
        })
        .catch(err => console.error('error adding task', err));
    }

    function updateTaskOnServer(task) {
        fetch(`${apiUrl}/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({                                      
                                    title: task.title,
                                    completed: task.active,
                                    id: task.id
                                })
        })
        .then(response => response.json())
        .then(updatedTask => {
            console.log('after update', updatedTask);
        })
    }

    function deleteTask(activeTaskIds) {
            activeTaskIds.forEach(taskId => {
                tasks.filter( task => task.id !== taskId)
                console.log('new',tasks)
            } )
    }


    function displayTask() {
        // Clear existing list
        taskList.innerHTML = ''
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item my-1';
            listItem.style.cursor = 'pointer';
            // Click on item and show the id
            listItem.addEventListener('click', () => updateTask(task))
            if (task.active) {
                listItem.classList.add('active');
            }
            listItem.innerHTML = `
            <span class="form-check-label" id='task${task.id}'>${task.title}</span>
            `;
            taskList.appendChild(listItem)
        })
    }
    
});