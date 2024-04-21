import {
  selectAllTasks,
  createTaskRecord,
  getTaskById,
  deleteTaskById,
  updateTaskById,
} from '../db/index.js';
import { createApiError } from '../errors/index.js';
import { asyncWrapper } from '../middleware/async.js';

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await selectAllTasks();
  return res.status(200).json({ tasks });
});

const createTask = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  await createTaskRecord(name);
  return res.status(201).json({ message: 'Task created successfully' });
});

const getTask = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const task = await getTaskById(id);
  if (!task) {
    const error = createApiError('Task not found', 404);
    return next(error);
    // throw error;
  }
  return res.status(201).json({ task });
});

const deleteTask = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteTaskById(id);

  if (deleted) {
    return res.status(201).json({ message: 'Task deleted successfully' });
  } else {
    return res.status(404).json({ message: 'Task not found' });
  }
});

const updateTask = asyncWrapper(async (req, res) => {
  const id = req.params.id;
  const task = await getTaskById(id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  const { name } = req.body;

  const updated = await updateTaskById(id, name);

  if (!updated) {
    return res.status(500).json({ message: 'Failed to update task' });
  }
  return res.status(201).json({ message: 'Task updated successfully' });
});

export { getAllTasks, createTask, updateTask, getTask, deleteTask };
