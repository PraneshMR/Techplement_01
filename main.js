// todo_app/static/main.js
document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const tasksContainer = document.getElementById('tasks-container');

    // Function to fetch tasks from the API and display them
    function fetchAndDisplayTasks() {
        fetch('/api/tasks/')
            .then(response => response.json())
            .then(tasks => {
                tasksContainer.innerHTML = '';
                tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('task');
                    taskElement.innerHTML = `
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                    `;
                    tasksContainer.appendChild(taskElement);
                });
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Function to add a new task via the API
    function addTask(title, description) {
        fetch('/api/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ title, description }),
        })
            .then(response => response.json())
            .then(() => {
                fetchAndDisplayTasks();
                taskForm.reset();
            })
            .catch(error => console.error('Error adding task:', error));
    }

    // Function to delete a task via the API
    window.deleteTask = function (taskId) {
        fetch(`/api/tasks/${taskId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
        })
            .then(response => response.json())
            .then(fetchAndDisplayTasks)
            .catch(error => console.error('Error deleting task:', error));
    };

    // Function to get CSRF token from cookies
    function getCSRFToken() {
        const cookies = document.cookie.split(';');
        const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
        if (csrfCookie) {
            return csrfCookie.split('=')[1];
        }
        return null;
    }

    // Event listener for the task form submission
    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        if (title && description) {
            addTask(title, description);
        }
    });

    // Initial fetch and display tasks
    fetchAndDisplayTasks();
});
