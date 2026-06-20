import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private/Candidate
export const applyToJob = async (req, res) => {
  // Only candidates can apply
  if (req.user.role !== 'candidate') {
    res.status(403).json({ message: 'Only candidates can apply for jobs' });
    return;
  }

  const { jobId, resumeUrl, coverLetter } = req.body;

  if (!jobId) {
    res.status(400).json({ message: 'Job ID is required' });
    return;
  }

  // Validate resume URL format if provided
  if (resumeUrl && resumeUrl.trim()) {
    try {
      new URL(resumeUrl);
    } catch {
      res.status(400).json({ message: 'Please provide a valid resume URL' });
      return;
    }
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (alreadyApplied) {
      res.status(400).json({ message: 'You have already applied for this job' });
      return;
    }

    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      resumeUrl,
      coverLetter
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get current user's applications (candidate) or received applications (employer)
// @route   GET /api/applications
// @access  Private
export const getUserApplications = async (req, res) => {
  try {
    if (req.user.role === 'employer') {
      // Find all jobs posted by this employer
      const employerJobs = await Job.find({ postedBy: req.user._id });
      const jobIds = employerJobs.map(job => job._id);

      // Find all applications for those jobs
      const applications = await Application.find({ job: { $in: jobIds } })
        .populate('job', 'title company salary location')
        .populate('applicant', 'name email')
        .sort({ createdAt: -1 });

      res.json(applications);
    } else {
      // Candidate: Find all applications made by this candidate
      const applications = await Application.find({ applicant: req.user._id })
        .populate('job', 'title company salary location type category')
        .sort({ createdAt: -1 });

      res.json(applications);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Employer
export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    // Verify that the logged-in user is the employer who posted the job
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to modify this application' });
      return;
    }

    application.status = status;
    const updatedApplication = await application.save();
    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
