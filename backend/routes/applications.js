import express from 'express';
import { applyToJob, getUserApplications, updateApplicationStatus } from '../controllers/applicationsController.js';
import { protect, employerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, applyToJob)
  .get(protect, getUserApplications);

router.route('/:id')
  .put(protect, employerOnly, updateApplicationStatus);

export default router;
