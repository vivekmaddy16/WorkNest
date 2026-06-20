import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import api from '../utils/api';

const Dashboard = ({ userInfo }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [employerJobs, setEmployerJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const { data } = await api.get('/applications');
        setApplications(data);

        // If employer, also fetch their own jobs
        if (userInfo.role === 'employer') {
          const jobsRes = await api.get('/jobs');
          const myJobs = jobsRes.data.filter(
            (job) => job.postedBy === userInfo._id || job.postedBy?._id === userInfo._id
          );
          setEmployerJobs(myJobs);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo, navigate]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}`, { status: newStatus });
      setApplications(prev =>
        prev.map(app => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
      toast.success(`Application status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update application status.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/jobs/${jobId}`);
      setEmployerJobs(prev => prev.filter(j => j._id !== jobId));
      // Also remove applications for this job from view
      setApplications(prev => prev.filter(app => app.job?._id !== jobId));
      toast.success('Job listing deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete job listing.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          <div className="skeleton-line" style={{ width: '260px', height: '32px', marginBottom: '12px' }}></div>
          <div className="skeleton-line" style={{ width: '380px', height: '16px', marginBottom: '40px' }}></div>
          <div className="dashboard-stats-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="dashboard-stat-card">
                <div className="skeleton-line" style={{ width: '140px', height: '14px', marginBottom: '12px' }}></div>
                <div className="skeleton-line" style={{ width: '60px', height: '36px' }}></div>
              </div>
            ))}
          </div>
          <div className="skeleton-line" style={{ width: '200px', height: '20px', marginBottom: '18px' }}></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-line" style={{ width: '100%', height: '60px', marginBottom: '8px', borderRadius: '12px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        
        <div className="dashboard-header">
          <div>
            <h2 className="auth-title" style={{ fontSize: '28px' }}>User Control Panel</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Manage applications and check matching status pipeline.
            </p>
          </div>
          {userInfo.role === 'employer' && (
            <button className="btn-green" onClick={() => navigate('/post-job')}>
              Post a New Job
            </button>
          )}
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* Stats Section */}
        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <div className="title">
              {userInfo.role === 'employer' ? 'Total Applications Received' : 'Applied Jobs'}
            </div>
            <div className="value">{applications.length}</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="title">Active Statuses</div>
            <div className="value">
              {applications.filter(app => ['Applied', 'Shortlisted', 'Interviewing'].includes(app.status)).length}
            </div>
          </div>
          <div className="dashboard-stat-card">
            <div className="title">Hires / Placements</div>
            <div className="value" style={{ color: '#1A7A5E' }}>
              {applications.filter(app => app.status === 'Hired').length}
            </div>
          </div>
        </div>

        {/* Employer: Job Listings Management */}
        {userInfo.role === 'employer' && employerJobs.length > 0 && (
          <>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '18px', color: 'var(--dark)' }}>
              Your Job Listings
            </h3>
            <div className="dashboard-table-container" style={{ marginBottom: '40px' }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employerJobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <Link to={`/jobs/${job._id}`} style={{ fontWeight: '600', color: 'var(--green)' }}>
                          {job.title}
                        </Link>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{job.company}</div>
                      </td>
                      <td>{job.category}</td>
                      <td><span className="job-badge">{job.type}</span></td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteJob(job._id)}
                          title="Delete this job"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Main Applications List */}
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '18px', color: 'var(--dark)' }}>
          {userInfo.role === 'employer' ? 'Received Applications' : 'Your Job Applications'}
        </h3>

        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', border: '1.5px solid var(--gray-200)' }}>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {userInfo.role === 'employer'
                ? 'No candidates have applied to your job postings yet.'
                : 'You have not applied to any jobs yet.'}
            </p>
            {userInfo.role !== 'employer' && (
              <Link to="/jobs" className="btn-green">
                Browse Job Board
              </Link>
            )}
          </div>
        ) : (
          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                {userInfo.role === 'employer' ? (
                  <tr>
                    <th>Candidate</th>
                    <th>Job Title</th>
                    <th>Applied Date</th>
                    <th>Resume</th>
                    <th>Status</th>
                    <th>Manage</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Job Role</th>
                    <th>Company</th>
                    <th>Salary Package</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    {userInfo.role === 'employer' ? (
                      <>
                        <td>
                          <div style={{ fontWeight: '600' }}>{app.applicant?.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.applicant?.email}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: '600' }}>{app.job?.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.job?.company}</div>
                        </td>
                        <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td>
                          {app.resumeUrl ? (
                            <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--green)', fontWeight: '600', textDecoration: 'underline' }}>
                              View CV Link
                            </a>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Not provided</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge status-${app.status}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="action-select"
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <Link to={`/jobs/${app.job?._id}`} style={{ fontWeight: '600', color: 'var(--green)' }}>
                            {app.job?.title || 'N/A'}
                          </Link>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.job?.category}</div>
                        </td>
                        <td>{app.job?.company || 'N/A'}</td>
                        <td>{app.job?.salary || 'N/A'}</td>
                        <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge status-${app.status}`}>
                            {app.status}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
