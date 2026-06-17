import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const JobListings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local state for forms
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  const categories = ['All', 'Technology', 'Design', 'Finance', 'Marketing', 'Sales', 'HR'];

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        
        let url = '/jobs';
        const params = [];
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (category && category !== 'All') params.push(`category=${encodeURIComponent(category)}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const { data } = await api.get(url);
        setJobs(data);
      } catch (err) {
        setError('Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (searchText) newParams.search = searchText;
    if (selectedCategory && selectedCategory !== 'All') newParams.category = selectedCategory;
    setSearchParams(newParams);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const newParams = {};
    if (searchText) newParams.search = searchText;
    if (cat && cat !== 'All') newParams.category = cat;
    setSearchParams(newParams);
  };

  return (
    <div className="dashboard-container">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '8px' }}>
          Explore Job Openings
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Find full-time, part-time, remote, or hybrid roles tailored to your career aspirations.
        </p>

        {/* Search & Filter Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <input
              type="text"
              className="form-input"
              style={{ borderRadius: '8px', padding: '14px 18px' }}
              placeholder="Search by job title, company, or keyword..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-green" style={{ padding: '12px 28px', borderRadius: '8px' }}>
            Search
          </button>
        </form>

        {/* Category filters */}
        <div className="filter-tabs" style={{ justifyContent: 'flex-start', marginBottom: '40px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && <div className="auth-error">{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            Searching database for matching jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', border: '1.5px solid var(--gray-200)' }}>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              🤖 No job listings found.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Try adjusting your search criteria or reset filters.
            </p>
          </div>
        ) : (
          <div className="jobs-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {jobs.map((job) => (
              <div key={job._id} className="job-card visible-animated" onClick={() => navigate(`/jobs/${job._id}`)}>
                <div className="job-card-top">
                  <div className="company-logo-sm" style={{ background: job.companyLogo || 'var(--green)' }}>
                    {job.company.substring(0, 2)}
                  </div>
                  <span className="job-badge">{job.type}</span>
                </div>
                <h3 style={{ fontSize: '17px', marginBottom: '6px' }}>{job.title}</h3>
                <p className="company" style={{ marginBottom: '16px' }}>{job.company}</p>
                <div className="job-meta">
                  <div className="meta-tag">⏰ {job.jobDuration || 'Full-time'}</div>
                  <div className="meta-tag">📍 {job.location}</div>
                  <div className="meta-tag">🎓 {job.experience}</div>
                  <div className="meta-tag">💼 {job.category}</div>
                </div>
                <div className="job-card-bottom">
                  <div className="salary">{job.salary}</div>
                  <button className="apply-btn">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
