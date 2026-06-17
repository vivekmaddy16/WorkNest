import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route files
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import aiRoutes from './routes/ai.js';

// Models for seeding
import User from './models/User.js';
import Job from './models/Job.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('WorkNest API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Seed default jobs if database is empty
const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      // Create admin/employer user
      const admin = await User.create({
        name: 'WorkNest Admin',
        email: 'admin@worknest.com',
        password: 'adminpassword123',
        role: 'employer'
      });

      console.log('Admin user seeded: admin@worknest.com / adminpassword123');

      // Create default jobs
      await Job.create([
        {
          title: 'Senior Frontend Developer',
          company: 'Google',
          location: 'Remote',
          salary: '₹28L/yr',
          category: 'Technology',
          experience: '3+ yrs',
          type: 'Remote',
          jobDuration: 'Full-time',
          description: 'We are looking for a Senior Frontend Developer with deep knowledge of React, state management, and modern CSS layouts to build next-generation collaboration tools.',
          postedBy: admin._id
        },
        {
          title: 'Finance Staff Lead',
          company: 'Flipkart',
          location: 'Bangalore',
          salary: '₹22L/yr',
          category: 'Finance',
          experience: '5+ yrs',
          type: 'Hybrid',
          jobDuration: 'Full-time',
          description: 'Lead the financial planning, analysis, and forecasting operations for Flipkart\'s logistics wing. Require strong expertise in corporate finance and business analysis.',
          postedBy: admin._id
        },
        {
          title: 'UX/UI Designer',
          company: 'Amazon',
          location: 'Hyderabad',
          salary: '₹16L/yr',
          category: 'Design',
          experience: '2+ yrs',
          type: 'On-site',
          jobDuration: 'Full-time',
          description: 'Join Amazon Customer Experience team. Design intuitive interface designs and user journeys across web and mobile platforms. Portfolio required.',
          postedBy: admin._id
        },
        {
          title: 'Social Media Expert',
          company: 'Bharatpe',
          location: 'Remote',
          salary: '₹8L/yr',
          category: 'Marketing',
          experience: '1+ yr',
          type: 'Remote',
          jobDuration: 'Part-time',
          description: 'Help manage and scale BharatPe\'s organic brand presence across Twitter, LinkedIn, and Instagram. Must have excellent copywriting and trend awareness.',
          postedBy: admin._id
        }
      ]);
      console.log('Default job listings seeded successfully!');
    }
  } catch (error) {
    console.error('Seeding database failed:', error.message);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running in development mode on port ${PORT}`);
  await seedDatabase();
});
