import {
  selectAllTasks,
  createTaskRecord,
  getTaskById,
  deleteTaskById,
  updateTaskById,
} from "../db/index.js";

// TODO:
// [ ] Add error to all res

const getAllTasks = async (req, res) => {
  try {
    const tasks = await selectAllTasks();
    return res.status(200).json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const { name } = req.body;
    await createTaskRecord(name);
    return res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const getTask = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await getTaskById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(201).json({ task });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteTaskById(id);

    if (deleted) {
      return res.status(201).json({ message: "Task deleted successfully" });
    } else {
      return res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await getTaskById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const { name } = req.body;

    const updated = await updateTaskById(id, name);

    if (!updated) {
      return res.status(500).json({ message: "Failed to update task" });
    }
    return res.status(201).json({ message: "Task updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export { getAllTasks, createTask, updateTask, getTask, deleteTask };
