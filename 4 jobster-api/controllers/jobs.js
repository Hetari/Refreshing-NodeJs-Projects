const getAllJobs = async (req, res) => {
  res.send('get all jobs');
};

const getJob = async (req, res) => {
  res.send(`get job with id: ${req.params.id}`);
};

const createJob = async (req, res) => {
  res.send('create a new job');
};

const updateJob = async (req, res) => {
  res.send('update job');
};

const deleteJob = async (req, res) => {
  res.send('delete job');
};

export { getAllJobs, getJob, createJob, updateJob, deleteJob };
