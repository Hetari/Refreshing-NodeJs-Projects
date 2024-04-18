const getAllTasks = (req, res) => {
  res.send("All items");
};

const createTask = (req, res) => {
  res.send("create");
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
