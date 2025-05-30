const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs").promises;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;

function createHash(length = 8) {
  return crypto.randomBytes(length).toString("hex");
}

const getTasks = async () => {
  const file = "./data.json";
  const data = await fs.readFile(file, "utf8");
  const jsonData = await JSON.parse(data);

  return jsonData;
};

const writeTasks = async (tasks) => {
  const file = "./data.json";
  await fs.writeFile(file, JSON.stringify(tasks), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Successfully wrote to file");
    }
  });
};

app.get("/api/tasks", async function (req, res) {
  const filter = req.query.filter;
  const sort = req.query.sort;

  let tasksArray = Object.entries(await getTasks()).map(
    ([key, value]) => value
  );

  // FILTERING
  if (filter !== "all") {
    tasksArray = tasksArray.filter((task) => task.status === filter);
  }

  // SORTING
  if (sort === "modified") {
    tasksArray = tasksArray.sort(
      (a, b) => new Date(a.modifiedAt) - new Date(b.modifiedAt)
    );
  } else if (sort === "title") {
    tasksArray = tasksArray.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    tasksArray = tasksArray.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  res.send(tasksArray);
});

app.post("/api/tasks", async function (req, res) {
  const id = createHash();
  const newTask = { id, createdAt: new Date(), ...req.body };
  tasks = { ...(await getTasks()), [id]: newTask };

  await writeTasks(tasks);

  res.send(newTask);
});

app.put("/api/tasks/:id", async function (req, res) {
  const id = req.params.id;
  const newTask = { ...req.body, modifiedAt: new Date() };
  let tasks = await getTasks();
  tasks[id] = newTask;

  if (!tasks[id]) {
    res.sendStatus(404);
  }

  await writeTasks(tasks);

  res.send(newTask);
});

app.delete("/api/tasks/:id", async function (req, res) {
  let tasks = await getTasks();
  let task = tasks[req.params.id];
  if (!task) {
    res.sendStatus(404);
  }
  delete task;

  await writeTasks(tasks);

  res.send({ id: req.params.id });
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
