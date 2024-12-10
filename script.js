document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const deadlineInput = document.getElementById("deadlineInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const taskList = document.getElementById("taskList");
  
    // Load tasks from localStorage
    const loadTasks = () => {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      
      // Sort tasks: completed tasks last, and within each group, sort by deadline
      return tasks.sort((a, b) => {
        // If both tasks are completed or both are not completed, sort by deadline
        if (a.completed === b.completed) {
          return new Date(a.deadline) - new Date(b.deadline);
        }
        // If one task is completed and the other is not, put incomplete tasks first
        return a.completed ? 1 : -1;
      });
    };
  
    // Save tasks to localStorage
    const saveTasks = (tasks) => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    };
  
    // Render tasks in the table
    const renderTasks = () => {
      const tasks = loadTasks();
      taskList.innerHTML = tasks
        .map(
          (task, index) => `
          <tr>
            <td>${index + 1}</td>
            <td class="${task.completed ? "completed" : ""}">${task.name}</td>
            <td>${new Date(task.createdOn).toLocaleString()}</td>
            <td>${new Date(task.deadline).toLocaleString()}</td>
            <td>
              <input type="checkbox" ${
                task.completed ? "checked" : ""
              } onchange="toggleTaskCompletion(${index})" />
              ${
                task.completed
                  ? `<br><small>${task.completedOn}</small>`
                  : ""
              }
            </td>
            <td>
              <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </td>
          </tr>
        `
        )
        .join("");
    };
  
    // Add a new task
    const addTask = () => {
      const taskName = taskInput.value.trim();
      const deadline = deadlineInput.value;
  
      // Input validation
      if (!taskName || !deadline) {
        alert("Please enter both task and deadline!");
        return;
      }
  
      const currentDateTime = new Date().toISOString().slice(0, 16);
      
      // Validate deadline to ensure it's not in the past
      if (deadline < currentDateTime) {
        alert("The deadline cannot be in the past!");
        return;
      }
  
      const tasks = loadTasks();
      tasks.push({
        name: taskName,
        createdOn: new Date(),
        deadline: deadline,
        completed: false,
        completedOn: null,
      });
  
      saveTasks(tasks);
      renderTasks();
      taskInput.value = "";
      deadlineInput.value = "";
    };
  
    // Toggle task completion
    window.toggleTaskCompletion = (index) => {
      const tasks = loadTasks();
      const task = tasks[index];
      task.completed = !task.completed;
      task.completedOn = task.completed ? new Date().toLocaleString() : null;
  
      saveTasks(tasks);
      renderTasks();
    };
  
    // Delete a task
    window.deleteTask = (index) => {
      if (confirm("Are you sure you want to delete this task?")) {
        const tasks = loadTasks();
        tasks.splice(index, 1);
  
        saveTasks(tasks);
        renderTasks();
      }
    };
  
    // Add task button click event
    addTaskButton.addEventListener("click", addTask);
  
    // Initial render of tasks
    renderTasks();
  });
  