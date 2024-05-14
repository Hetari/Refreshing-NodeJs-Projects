import { Router } from 'express';
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobs.js';

const jobRouter = Router();

jobRouter.route('/').post(createJob).get(getAllJobs);
jobRouter.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

export default jobRouter;
