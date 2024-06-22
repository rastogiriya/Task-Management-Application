document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  if (form) {
    form.addEventListener("submit", addTask);
  }

  const taskList = document.getElementById("taskList");
  if (taskList) {
    loadTasks();
  }
});

async function loadTasks() {
  try {
    const response = await fetch("http://localhost:5000/tasks");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const tasks = await response.json();
    tasks.forEach((task) => addTaskToDOM(task));
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

async function addTask(e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const dueDate = document.getElementById("dueDate").value;
  const task = { title, description, dueDate };

  try {
    const response = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    document.getElementById("taskForm").reset();
    window.location.href = "tasks.html"; // Redirect to the tasks table page
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

async function editTask(id) {
  try {
    const response = await fetch(`http://localhost:5000/tasks/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const task = await response.json();

    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("dueDate").value = task.dueDate;

    deleteTask(id);
  } catch (error) {
    console.error("Error editing task:", error);
  }
}

async function deleteTask(id) {
  try {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
    document.querySelector(`[data-id='${id}']`).remove();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

// changes to add inline editing

async function addTaskToDOM(task) {
  const taskList = document.getElementById("taskList");
  if (!taskList) return;

  const tr = document.createElement("tr");
  tr.setAttribute("data-id", task.id);
  tr.innerHTML = `
      <td><div class="editable" contenteditable="true">${task.title}</div></td>
      <td><div class="editable" contenteditable="true">${task.description}</div></td>
      <td><div class="editable" contenteditable="true">${task.dueDate}</div></td>
      <td>
          <button class="btn btn-info btn-sm" onclick="saveTask(${task.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
      </td>
  `;
  taskList.appendChild(tr);
}

async function saveTask(id) {
  try {
    const tr = document.querySelector(`[data-id='${id}']`);
    const title = tr
      .querySelector("td:nth-child(1) .editable")
      .textContent.trim();
    const description = tr
      .querySelector("td:nth-child(2) .editable")
      .textContent.trim();
    const dueDate = tr
      .querySelector("td:nth-child(3) .editable")
      .textContent.trim();

    const task = { title, description, dueDate };

    const response = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Optionally update the task data in the DOM after successful save
    tr.querySelector(
      "td:nth-child(1)"
    ).innerHTML = `<div class="editable" contenteditable="true">${task.title}</div>`;
    tr.querySelector(
      "td:nth-child(2)"
    ).innerHTML = `<div class="editable" contenteditable="true">${task.description}</div>`;
    tr.querySelector(
      "td:nth-child(3)"
    ).innerHTML = `<div class="editable" contenteditable="true">${task.dueDate}</div>`;

    const saveButton = tr.querySelector(".btn-info");
    saveButton.textContent = "Edit";
    saveButton.setAttribute("onclick", `saveTask(${id})`);
  } catch (error) {
    console.error("Error saving task:", error);
  }
}
