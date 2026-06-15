/**
 * script.js
 * CSE 310 - Module 3: Language - JavaScript
 * Author: Collins Chibuike Okolie
 *
 * A web-based To-Do List application.
 * Demonstrates: DOM manipulation, ES6 array functions (map, filter, forEach),
 * recursion, and the SweetAlert2 library for confirmation dialogs.
 */

// -------------------------------------------------------
// Array that stores all task objects in memory
// Each task is an object: { id, text, completed }
// -------------------------------------------------------
let tasks = [];

// Tracks the current filter: "all", "active", or "completed"
let currentFilter = "all";

// Used to generate a unique ID for each new task
let nextId = 1;

// -------------------------------------------------------
// Grab references to DOM elements we will use repeatedly
// -------------------------------------------------------
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const statsDiv = document.getElementById("stats");
const filterButtons = document.querySelectorAll(".filter-btn");

// -------------------------------------------------------
// addTask() - Adds a new task to the tasks array
// -------------------------------------------------------
/**
 * Reads the value from the input field, validates it,
 * creates a new task object, adds it to the tasks array,
 * clears the input, and re-renders the list.
 */
function addTask() {
    const text = taskInput.value.trim();

    // Validation - don't add empty tasks
    if (text === "") {
        Swal.fire({
            icon: "warning",
            title: "Empty Task",
            text: "Please type something before adding a task!"
        });
        return;
    }

    // Create a new task object and add it to the array
    const newTask = {
        id: nextId++,
        text: text,
        completed: false
    };
    tasks.push(newTask);

    // Clear the input field for the next entry
    taskInput.value = "";
    taskInput.focus();

    // Re-render the list to show the new task
    renderTasks();
}

// -------------------------------------------------------
// toggleComplete() - Marks a task as completed/uncompleted
// -------------------------------------------------------
/**
 * Finds the task with the given id using the Array.find()
 * method (an ES6 array function) and flips its completed
 * boolean value, then re-renders the list.
 * @param {number} id - The unique id of the task to toggle
 */
function toggleComplete(id) {
    // .find() is a native ES6 Array function
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

// -------------------------------------------------------
// deleteTask() - Removes a task after user confirmation
// -------------------------------------------------------
/**
 * Uses the SweetAlert2 library to show a confirmation dialog.
 * If the user confirms, removes the task from the tasks array
 * using the .filter() ES6 array function and re-renders the list.
 * @param {number} id - The unique id of the task to delete
 */
function deleteTask(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "This task will be permanently removed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ff4d4f"
    }).then((result) => {
        // result.isConfirmed is true only if the user clicked "Yes, delete it"
        if (result.isConfirmed) {
            // .filter() is a native ES6 Array function - keeps all tasks
            // EXCEPT the one whose id matches the one being deleted
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Your task has been removed.",
                timer: 1200,
                showConfirmButton: false
            });
        }
    });
}

// -------------------------------------------------------
// setFilter() - Changes the current filter and re-renders
// -------------------------------------------------------
/**
 * Updates the currentFilter variable, updates the active
 * button styling, and re-renders the task list.
 * @param {string} filter - "all", "active", or "completed"
 */
function setFilter(filter) {
    currentFilter = filter;

    // Update which filter button has the "active" class
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    renderTasks();
}

// -------------------------------------------------------
// getFilteredTasks() - Returns tasks based on current filter
// -------------------------------------------------------
/**
 * Uses the .filter() ES6 array function to return only
 * the tasks that match the current filter setting.
 * @return {Array} The filtered array of task objects
 */
function getFilteredTasks() {
    if (currentFilter === "active") {
        return tasks.filter(t => !t.completed);
    } else if (currentFilter === "completed") {
        return tasks.filter(t => t.completed);
    }
    // "all" filter - return every task
    return tasks;
}

// -------------------------------------------------------
// countCompleted() - RECURSIVE function
// -------------------------------------------------------
/**
 * Recursively counts how many tasks in the given array
 * are marked as completed. This demonstrates recursion by
 * processing one element at a time and calling itself on
 * the remaining "rest" of the array (the base case is an
 * empty array, which returns 0).
 * @param {Array} taskArray - The array of tasks to count
 * @return {number} The number of completed tasks
 */
function countCompleted(taskArray) {
    // Base case: an empty array has zero completed tasks
    if (taskArray.length === 0) {
        return 0;
    }

    // Look at the first task in the array
    const first = taskArray[0];

    // The "rest" of the array, excluding the first element
    const rest = taskArray.slice(1);

    // If the first task is completed, count it as 1, otherwise 0,
    // then add the recursive result of counting the rest of the array
    if (first.completed) {
        return 1 + countCompleted(rest);
    } else {
        return 0 + countCompleted(rest);
    }
}

// -------------------------------------------------------
// renderTasks() - Renders the task list to the DOM
// -------------------------------------------------------
/**
 * Clears the current task list in the DOM and rebuilds it
 * based on the filtered tasks. Uses .forEach() (an ES6 array
 * function) to create a list item for each task. Also updates
 * the statistics section using the recursive countCompleted()
 * function.
 */
function renderTasks() {
    // Clear the current list - remove all existing child elements
    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    // If there are no tasks to show, display a friendly message
    if (filteredTasks.length === 0) {
        const emptyMsg = document.createElement("li");
        emptyMsg.className = "empty-message";
        emptyMsg.textContent = "No tasks here. Add one above!";
        taskList.appendChild(emptyMsg);
    } else {
        // .forEach() is a native ES6 Array function
        filteredTasks.forEach(task => {
            // Create the main list item element
            const li = document.createElement("li");
            li.className = "task-item";

            // Create the left side container (checkbox + text)
            const leftDiv = document.createElement("div");
            leftDiv.className = "task-left";

            // Create the checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => toggleComplete(task.id));

            // Create the text span
            const span = document.createElement("span");
            span.className = task.completed ? "task-text completed" : "task-text";
            span.textContent = task.text;

            // Assemble the left side
            leftDiv.appendChild(checkbox);
            leftDiv.appendChild(span);

            // Create the delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => deleteTask(task.id));

            // Assemble the full list item and add it to the list
            li.appendChild(leftDiv);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    // Update the statistics section using recursion
    updateStats();
}

// -------------------------------------------------------
// updateStats() - Displays task count summary
// -------------------------------------------------------
/**
 * Calculates the total number of tasks and the number of
 * completed tasks (using the recursive countCompleted function)
 * and displays a summary message in the stats section.
 */
function updateStats() {
    const total = tasks.length;
    const completed = countCompleted(tasks); // recursive call
    const remaining = total - completed;

    if (total === 0) {
        statsDiv.textContent = "No tasks yet. Start by adding one above!";
    } else {
        statsDiv.textContent =
            `Total: ${total} | Completed: ${completed} | Remaining: ${remaining}`;
    }
}

// -------------------------------------------------------
// EVENT LISTENERS - Set up interactivity
// -------------------------------------------------------

// Add task when the Add button is clicked
addBtn.addEventListener("click", addTask);

// Add task when the user presses Enter in the input field
taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Set up filter button click handlers
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

// -------------------------------------------------------
// Initial render when the page first loads
// -------------------------------------------------------
renderTasks();