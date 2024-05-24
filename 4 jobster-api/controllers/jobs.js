import { BadRequestError, NotFoundError } from '../errors/index.js';
import pool from '../db/connect.js';
import { insertJob, selectAllJobs, updateJopRecord } from '../db/index.js';

const getAllJobs = async (req, res) => {
  const {
    id,
    company,
    position,
    status,
    created_by,
    created_at,
    updated_at,
    select,
  } = req.query;

  let criteria = {};
  let columns = select ? select.split(',') : ['*'];

  // Build criteria object
  // sourcery skip: use-braces
  if (id) criteria.id = id;
  if (company) criteria.name = company;
  if (position) criteria.position = position;
  if (status) criteria.status = status;
  if (created_by) criteria.created_by = created_by;
  if (created_at) criteria.created_at = created_at;
  if (updated_at) criteria.updated_at = updated_at;

  // try {
  // Implement pagination
  let jobs = await selectAllJobs(pool, criteria, columns);

  if (jobs.length === 0) {
    return res.json({ message: 'No jobs found' });
  }

  return res.json({ jobs });
  // } catch (error) {
  //   return res.status(500).json({ error: error.message });
  // }
};

const getJob = async (req, res) => {
  const { id } = req.params;
  req.query.id = id;
  getAllJobs(req, res);
};

const createJob = async (req, res) => {
  const { company, position, status } = req.body;

  if (!company || !position || !status) {
    throw new BadRequestError('company, position, and status are required!');
  }

  if (
    typeof company !== 'string' ||
    typeof position !== 'string' ||
    typeof status !== 'string'
  ) {
    throw new BadRequestError('All fields must be strings');
  }

  if (!['interview', 'declined', 'pending'].includes(status.toLowerCase())) {
    throw new BadRequestError(
      "status property must be one of these 'interview', 'declined', 'pending'"
    );
  }

  if (company.length < 3 || company.length > 50) {
    throw new BadRequestError(
      'Company name must be between 3 and 50 characters long'
    );
  }

  if (position.length < 3 || position.length > 100) {
    throw new BadRequestError(
      'Company position must be between 3 and 100 characters long'
    );
  }

  const job = {
    company,
    position,
    status: status,
    // .toLowerCase()
    user: req.user,
  };

  const row = await insertJob(pool, job);

  // effected rows number
  if (row !== 1) {
    throw new BadRequestError('Failed to create job');
  }
  return res.json({ message: 'create a new job', user: req.user, job });
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { company, position, status, created_by } = req.body;

  if (!id) {
    throw new BadRequestError('Job ID is required');
  }

  if (!company && !position && !status && !created_by) {
    throw new BadRequestError('At least one field must be provided to update');
  }

  const newData = { name: company, position, status, created_by };

  console.log(id);
  await updateJopRecord(pool, id, newData);

  return res.json({ message: 'Job updated successfully' });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError('Job ID is required');
  }

  // get that job
  const [job] = await pool.query(`SELECT * FROM jobs WHERE id = ?`, [id]);

  if (job.length !== 1) {
    throw new NotFoundError('Job not found');
  }

  const createdBy = req.user;
  if (job[0].created_by !== createdBy.id) {
    throw new BadRequestError('You are not allowed to delete this job');
  }

  const sql = 'DELETE FROM jobs WHERE id = ?';
  const [result] = await pool.query(sql, [id]);
  if (result.affectedRows === 0) {
    throw new NotFoundError('Job not found');
  }
  return res.json({ message: 'Job deleted successfully' });
};

export { getAllJobs, getJob, createJob, updateJob, deleteJob };
