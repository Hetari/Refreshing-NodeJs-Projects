import { createTaskRecord } from "../db/index.js";

const getAllTasks = (req, res) => {
  res.send("All items");
};

const createTask = async (req, res) => {
  const { name } = req.body;
  await createTaskRecord(name);
  return res.status(200).json({ message: "Task created successfully" });
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
