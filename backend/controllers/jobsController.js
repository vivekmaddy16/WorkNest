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

  try {
    const job = new Job({
      title,
      company,
      companyLogo,
      location,
      salary,
      category,
      experience,
      type,
      jobDuration,
      description,
      postedBy: req.user._id
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
