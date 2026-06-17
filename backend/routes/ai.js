import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ message: 'Message is required' });
    return;
  }

  const query = message.toLowerCase();
  
  try {
    let responseText = '';
    
    if (query.includes('job') || query.includes('hiring') || query.includes('find') || query.includes('work')) {
      let category = 'all';
      if (query.includes('design')) category = 'design';
      else if (query.includes('tech') || query.includes('react') || query.includes('software') || query.includes('node') || query.includes('frontend') || query.includes('developer')) category = 'technology';
      else if (query.includes('finance')) category = 'finance';
      else if (query.includes('marketing')) category = 'marketing';
      else if (query.includes('sales')) category = 'sales';

      // Find jobs in the database
      let dbQuery = {};
      if (category !== 'all') {
        dbQuery.category = { $regex: category, $options: 'i' };
      }

      const matchingJobs = await Job.find(dbQuery).limit(3);

      if (matchingJobs.length > 0) {
        responseText = `🤖 Found ${matchingJobs.length} active jobs matching your request:\n\n` + 
          matchingJobs.map(job => `• **${job.title}** at **${job.company}** (${job.location}) - ${job.salary}`).join('\n') + 
          `\n\nWould you like me to shortlist these or do you want to see details for any?`;
      } else {
        responseText = `🤖 I searched for active jobs, but couldn't find any listings matching your specific query. However, I can help you search by categories like Technology, Design, Finance, or Marketing. Just let me know what you're looking for!`;
      }
    } else if (query.includes('how') && (query.includes('work') || query.includes('use'))) {
      responseText = `🤖 WorkNest is simple! \n1. **Candidates** can register, create a profile, and click "Apply Now" on any job of interest.\n2. **Employers** can post job openings with qualifications and salary.\n3. **My AI Engine** automatically matches profiles with job requirements to speed up hiring.`;
    } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      responseText = `🤖 Hello! I'm the WorkNest AI Recruiter. I can help you search active job listings, guide you on how to apply, or help employers post jobs. What can I do for you today?`;
    } else {
      responseText = `🤖 I'm here as your smart WorkNest Recruiter Assistant. I can help you find job openings (e.g. "find tech jobs"), explain how WorkNest works, or answer details about our hiring platform. What's on your mind?`;
    }

    res.json({ reply: responseText });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
