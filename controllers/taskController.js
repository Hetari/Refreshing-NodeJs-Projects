import { createTaskRecord } from "../db/index.js";

const getAllTasks = (req, res) => {
  res.send("All items");
};

const createTask = async (req, res) => {
  try {
    const { name } = req.body;
    await createTaskRecord(name);
    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

const updateTask = (req, res) => {
  res.send("update");
};

const getTask = (req, res) => {
  res.send("get");
};

const deleteTask = (req, res) => {
  res.send("delete");
};

export { getAllTasks, createTask, updateTask, getTask, deleteTask };
