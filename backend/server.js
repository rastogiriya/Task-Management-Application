const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let tasks = [];

// Retrieve all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Create a new task
app.post("/tasks", (req, res) => {
  const task = req.body;
  task.id = Date.now();
  tasks.push(task);
  res.json(task);
});

// Retrieve a single task by ID
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (task) {
    res.json(task);
  } else {
    res.status(404).send("Task not found");
  }
});

// Update an existing task
app.put("/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).send("Task not found");
  }
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  tasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
  res.sendStatus(204);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
