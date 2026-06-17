import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const PostJob = ({ userInfo }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [category, setCategory] = useState('Technology');
  const [experience, setExperience] = useState('1+ yr');
  const [type, setType] = useState('Remote');
  const [jobDuration, setJobDuration] = useState('Full-time');
  const [description, setDescription] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If not employer, redirect out
    if (!userInfo) {
      navigate('/login?redirect=post-job');
    } else if (userInfo.role !== 'employer') {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Generate random background color for logo preview
    const colors = ['#1A56DB', '#7C3AED', '#FF9900', '#E05252', '#0077B5', '#1A7A5E'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    try {
      await api.post('/jobs', {
        title,
        company,
        companyLogo: randomColor,
        location,
        salary,
        category,
        experience,
        type,
        jobDuration,
        description,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job. Please fill all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ padding: '60px 20px' }}>
      <div className="auth-card" style={{ maxWidth: '650px' }}>
        <h2 className="auth-title">Post a New Job</h2>
        <p className="auth-subtitle">Fill in details to connect with the best candidates.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Senior React Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Job Location</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Bangalore, Hybrid or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary Package</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="₹24L/yr or ₹15,000/month"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Job Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Experience Required</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="2+ yrs, Freshers, etc."
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Workplace Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Duration</label>
              <select
                className="form-select"
                value={jobDuration}
                onChange={(e) => setJobDuration(e.target.value)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Job Description</label>
            <textarea
              required
              rows="6"
              className="form-input"
              placeholder="State the roles, responsibilities, technical stacks, and other key details here..."
              style={{ resize: 'vertical' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Posting Job listing...' : 'Publish Job Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
