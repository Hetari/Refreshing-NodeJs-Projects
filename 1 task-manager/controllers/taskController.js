import {
  selectAllTasks,
  createTaskRecord,
  getTaskById,
  deleteTaskById,
} from "../db/index.js";

const getAllTasks = async (req, res) => {
  try {
    const tasks = await selectAllTasks();
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const { name } = req.body;
    await createTaskRecord(name);
    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const updateTask = (req, res) => {
  res.send("update");
};

const getTask = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await getTaskById(id);
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const deleteTask = (req, res) => {
  try {
    const id = req.params.id;
    deleteTaskById(id);
    res.status(201).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export { getAllTasks, createTask, updateTask, getTask, deleteTask };
