import express from 'express';
import { getJobs, getJobById, createJob, deleteJob } from '../controllers/jobsController.js';
import { protect, employerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, employerOnly, createJob);

router.route('/:id')
  .get(getJobById)
  .delete(protect, employerOnly, deleteJob);

export default router;
