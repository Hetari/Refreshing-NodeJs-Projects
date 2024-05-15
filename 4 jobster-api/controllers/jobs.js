const getAllJobs = async (req, res) => {
  return res.json({ message: 'get all jobs' });
};

const getJob = async (req, res) => {
  return res.json({ message: `get job with id: ${req.params.id}` });
};

const createJob = async (req, res) => {
  return res.json({ message: 'create a new job' });
};

const updateJob = async (req, res) => {
  return res.json({ message: 'update job' });
};

const deleteJob = async (req, res) => {
  return res.json({ message: 'delete job' });
};

export { getAllJobs, getJob, createJob, updateJob, deleteJob };
