import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const JobDetails = ({ userInfo }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Apply form state
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch job details.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!resumeUrl.trim()) {
      setApplyError('Resume URL is required.');
      return;
    }

    setSubmitting(true);
    setApplyError('');
    try {
      await api.post('/applications', {
        jobId: job._id,
        resumeUrl,
        coverLetter
      });
      setApplySuccess(true);
      setResumeUrl('');
      setCoverLetter('');
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="job-details-container" style={{ textAlign: 'center', padding: '100px' }}>
        Loading job details...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-details-container" style={{ textAlign: 'center', padding: '100px' }}>
        <div className="auth-error" style={{ display: 'inline-block', maxWidth: '500px' }}>
          {error || 'Job not found.'}
        </div>
        <div style={{ marginTop: '20px' }}>
          <Link to="/jobs" className="btn-outline">Back to Job Board</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-container">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }} className="job-details-layout">
        
        {/* Main Details */}
        <div className="job-details-main">
          <h2>{job.title}</h2>
          <div className="company-line">{job.company}</div>
          
          <div className="job-details-info-row">
            <div className="item">📍 {job.location}</div>
            <div className="item">⏰ {job.jobDuration || 'Full-time'} · {job.type}</div>
            <div className="item">🎓 {job.experience}</div>
            <div className="item">💰 {job.salary}</div>
          </div>

          <div className="job-description-content">
            <h3>Job Description</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>
            
            <h3>About the Company</h3>
            <p>
              {job.company} is a leading organization in the {job.category} industry. We strive to foster an environment of growth, collaboration, and high-impact contribution. Join our team to make a lasting difference.
            </p>
          </div>
        </div>

        {/* Sidebar Apply Form */}
        <div className="job-details-sidebar">
          <div className="sidebar-card">
            <h3>Application Portal</h3>

            {applySuccess ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ fontSize: '30px', marginBottom: '10px' }}>🎉</div>
                <h4 style={{ color: 'var(--green)', fontWeight: '700', marginBottom: '8px' }}>Application Sent!</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Your details have been successfully shared with {job.company}.
                </p>
                <Link to="/dashboard" className="btn-green" style={{ display: 'block', textAlign: 'center' }}>
                  View in Dashboard
                </Link>
              </div>
            ) : userInfo ? (
              userInfo.role === 'candidate' ? (
                <form onSubmit={handleApplySubmit}>
                  {applyError && <div className="auth-error" style={{ padding: '8px 12px', fontSize: '12px' }}>{applyError}</div>}
                  
                  <div className="form-group">
                    <label className="form-label">Resume Link (PDF/Drive)</label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/..."
                      className="form-input"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cover Letter (Optional)</label>
                    <textarea
                      rows="4"
                      placeholder="Why are you a good fit for this role?"
                      className="form-input"
                      style={{ resize: 'vertical' }}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Apply Now'}
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    📢 You are logged in as an <strong>Employer</strong>.
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Employers cannot apply for jobs.
                  </p>
                </div>
              )
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Please log in to apply for this job.
                </p>
                <button
                  className="btn-submit"
                  onClick={() => navigate(`/login?redirect=jobs/${job._id}`)}
                >
                  Log In to Apply
                </button>
                <div style={{ marginTop: '14px', fontSize: '12px' }}>
                  New here? <Link to="/register" style={{ color: 'var(--green)', fontWeight: '600' }}>Register now</Link>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobDetails;
