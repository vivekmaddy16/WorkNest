import Job from '../models/Job.js';

// @desc    Get all jobs (with optional search and category filters)
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { search, category } = req.query;
    
    let query = {};
    
    if (category && category.toLowerCase() !== 'all') {
      // Find category anywhere in category string (e.g. 'design', 'technology')
      query.category = { $regex: category, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');

    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private/Employer
export const createJob = async (req, res) => {
  const { title, company, companyLogo, location, salary, category, experience, type, jobDuration, description } = req.body;

  // Validate required fields
  if (!title || !company || !location || !salary || !category || !experience || !description) {
    res.status(400).json({ message: 'Please fill in all required fields' });
    return;
  }

  if (title.trim().length < 3 || title.trim().length > 100) {
    res.status(400).json({ message: 'Job title must be between 3 and 100 characters' });
    return;
  }

  if (description.trim().length < 20) {
    res.status(400).json({ message: 'Description must be at least 20 characters' });
    return;
  }

  try {
    const job = new Job({
      title: title.trim(),
      company: company.trim(),
      companyLogo,
      location: location.trim(),
      salary: salary.trim(),
      category,
      experience: experience.trim(),
      type,
      jobDuration,
      description: description.trim(),
      postedBy: req.user._id
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private/Employer
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    // Ensure only the employer who posted the job can delete it
    if (job.postedBy.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to delete this job' });
      return;
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
