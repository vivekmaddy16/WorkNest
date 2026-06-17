import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  
  // Testimonials state
  const testimonials = [
    {
      quote: "As a fresher, I'd tried multiple platforms, but none made the process this smooth. WorkNest connected me with my dream company in under 2 weeks. The AI matching is incredibly accurate!",
      avatar: "VK",
      avatarBg: "#1A7A5E",
      name: "Vivek Khanna",
      role: "Frontend Developer, Razorpay"
    },
    {
      quote: "Hiring used to take us months. With WorkNest's AI Recruiter, we shortlisted, interviewed, and offered a Senior Node Developer in just 4 days. The quality of candidates is unmatched.",
      avatar: "SR",
      avatarBg: "#7C3AED",
      name: "Shreya Rao",
      role: "HR Director, Google"
    },
    {
      quote: "The interface is so clean and easy to navigate compared to older job portals. I love how I can see exact salaries and verified tags on companies immediately. Highly recommended!",
      avatar: "AM",
      avatarBg: "#FF9900",
      name: "Amit Mishra",
      role: "Product Manager, Flipkart"
    }
  ];
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data.slice(0, 4)); // Get first 4 jobs for homepage
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Testimonial Carousel Auto-Play
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const filteredJobs = activeTab === 'All' 
    ? jobs 
    : jobs.filter(job => job.category.toLowerCase().includes(activeTab.toLowerCase()));

  const handleApplyClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const currentTestimonial = testimonials[testimonialIndex];

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div>
          <div className="hero-badge">
            <span className="ping"></span> 8M+ Jobs Available
          </div>
          <h1>Find Your<br /><span>Ideal Job</span><br />Today</h1>
          <p>The smarter way to connect talented professionals with top companies. Search, apply, and grow your career — all in one place.</p>
          <div className="search-bar">
            <input type="text" placeholder="Job title, keyword, or company..." onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/jobs?search=${e.target.value}`);
              }
            }} />
            <button onClick={(e) => {
              const input = e.target.previousSibling;
              navigate(`/jobs?search=${input.value}`);
            }}>Search</button>
          </div>
          <div className="hero-stats">
            <div className="stat-item"><div className="num">8M+</div><div className="label">Jobs posted</div></div>
            <div className="stat-item"><div className="num">120K+</div><div className="label">Companies hiring</div></div>
            <div className="stat-item"><div className="num">96%</div><div className="label">Placement rate</div></div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-card-main">
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '14px' }}>FEATURED OPENINGS</p>
            <div className="job-preview-list">
              <div className="job-preview-item">
                <div className="company-logo" style={{ background: '#1A56DB' }}>G</div>
                <div className="job-preview-info"><h4>Senior React Developer</h4><p>Google · Remote · Full-time</p></div>
                <div className="job-preview-salary">₹28L/yr</div>
              </div>
              <div className="job-preview-item">
                <div className="company-logo" style={{ background: '#E05252' }}>A</div>
                <div className="job-preview-info"><h4>Product Manager</h4><p>Amazon · Bangalore · Hybrid</p></div>
                <div className="job-preview-salary">₹32L/yr</div>
              </div>
              <div className="job-preview-item">
                <div className="company-logo" style={{ background: '#0077B5' }}>Li</div>
                <div className="job-preview-info"><h4>UX Designer</h4><p>LinkedIn · Mumbai · On-site</p></div>
                <div className="job-preview-salary">₹18L/yr</div>
              </div>
            </div>
          </div>
          <div className="hero-floating hero-float-1">
            <div style={{ width: '8px', height: '8px', background: '#22C55E', borderRadius: '50%' }}></div>
            <span style={{ color: 'var(--text)' }}>5k+ candidates hired today</span>
          </div>
          <div className="hero-floating hero-float-2">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Top applicants</div>
            <div className="avatars">
              <div className="avatar-sm" style={{ background: '#E05252' }}>R</div>
              <div className="avatar-sm" style={{ background: '#1A56DB' }}>S</div>
              <div className="avatar-sm" style={{ background: '#7C3AED' }}>A</div>
              <div className="avatar-sm" style={{ background: '#D97706' }}>P</div>
              <div className="avatar-sm" style={{ background: '#1A7A5E', fontSize: '8px' }}>+99</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <div className="trusted-by">
        <p>Trusted by leading companies</p>
        <div className="brand-row">
          <div className="brand-item">Infosys</div>
          <div className="brand-item">Wipro</div>
          <div className="brand-item">TCS</div>
          <div className="brand-item">HCL</div>
          <div className="brand-item">Razorpay</div>
          <div className="brand-item">Zomato</div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section>
        <div className="section-eyebrow">How It Works</div>
        <h2 className="section-title">Get to Work in 3 Simple Steps</h2>
        <p className="section-sub">Whether you're hiring talent or searching for your next role, WorkNest makes it seamless.</p>
        <div className="hiw-grid">
          <div className="hiw-card">
            <div className="hiw-icon">
              <svg viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <h3>Post a Job</h3>
            <p>Create your free job posting in minutes and receive competitive quotes from qualified professionals within hours.</p>
            <div className="link" onClick={() => navigate('/post-job')}>Post a job →</div>
          </div>
          <div className="hiw-card">
            <div className="hiw-icon">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <h3>Discover Talent</h3>
            <p>Our AI matches your requirements with the best-fit candidates. Review profiles, skills, and portfolios with ease.</p>
            <div className="link" onClick={() => navigate('/jobs')}>Browse jobs →</div>
          </div>
          <div className="hiw-card">
            <div className="hiw-icon">
              <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
            </div>
            <h3>Hire with Confidence</h3>
            <p>Secure payments, verified profiles, and dispute resolution — everything you need to work worry-free.</p>
            <div className="link" onClick={() => navigate('/jobs')}>Learn more →</div>
          </div>
        </div>
      </section>

      {/* WHY WORKNEST */}
      <section className="why-section">
        <div className="why-grid">
          <div className="why-content">
            <div className="section-eyebrow" style={{ textAlign: 'left' }}>Why Choose Us</div>
            <h2>Top Companies Post on WorkNest Every Day</h2>
            <p>Discover opportunities from industry leaders across technology, finance, design, and beyond. Whether you want a startup or an MNC — we have roles for every ambition.</p>
            <div className="why-stats">
              <div className="why-stat"><div className="num">8M+</div><div className="lbl">Active job listings</div></div>
              <div className="why-stat"><div className="num">120K</div><div className="lbl">Verified companies</div></div>
              <div className="why-stat"><div className="num">2.4M</div><div className="lbl">Successful hires</div></div>
              <div className="why-stat"><div className="num">96%</div><div className="lbl">Satisfaction rate</div></div>
            </div>
            <button className="btn-green" style={{ fontSize: '15px', padding: '12px 28px' }} onClick={() => navigate('/jobs')}>Explore Openings</button>
          </div>
          <div className="why-visual">
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>CURRENTLY HIRING</p>
            <div className="company-row">
              <div className="company-row-logo" style={{ background: '#EA4335' }}>G</div>
              <div className="company-row-info"><h5>Google</h5><p>Mountain View, CA · Remote OK</p></div>
              <span className="tag tag-green">Actively hiring</span>
            </div>
            <div className="company-row">
              <div className="company-row-logo" style={{ background: '#1A56DB' }}>M</div>
              <div className="company-row-info"><h5>Microsoft</h5><p>Hyderabad · On-site</p></div>
              <span className="tag tag-blue">12 openings</span>
            </div>
            <div className="company-row">
              <div className="company-row-logo" style={{ background: '#FF9900' }}>A</div>
              <div className="company-row-info"><h5>Amazon</h5><p>Bangalore · Hybrid</p></div>
              <span className="tag tag-orange">Urgent hire</span>
            </div>
            <div className="company-row">
              <div className="company-row-logo" style={{ background: '#7C3AED' }}>Z</div>
              <div className="company-row-info"><h5>Zomato</h5><p>Gurgaon · On-site</p></div>
              <span className="tag tag-green">8 openings</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section>
        <div className="section-eyebrow">Categories</div>
        <h2 className="section-title">Browse by Category</h2>
        <p className="section-sub">Find the perfect role in your field. Thousands of openings across every major industry.</p>
        <div className="cat-grid">
          <div className="cat-card" onClick={() => navigate('/jobs?category=technology')}>
            <div className="cat-icon" style={{ background: '#E8F5F0' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A7A5E" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div>
            <h4>Technology</h4>
            <span>3,240 jobs available</span>
          </div>
          <div className="cat-card" onClick={() => navigate('/jobs?category=design')}>
            <div className="cat-icon" style={{ background: '#FFF0E5' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C05A0A" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
            <h4>UI/UX Design</h4>
            <span>1,580 jobs available</span>
          </div>
          <div className="cat-card" onClick={() => navigate('/jobs?category=finance')}>
            <div className="cat-icon" style={{ background: '#EEF0FB' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A5FBF" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
            <h4>Finance</h4>
            <span>980 jobs available</span>
          </div>
          <div className="cat-card" onClick={() => navigate('/jobs?category=hr')}>
            <div className="cat-icon" style={{ background: '#F5E8FB' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></div>
            <h4>HR & Talent</h4>
            <span>620 jobs available</span>
          </div>
        </div>
      </section>

      {/* AI RECRUITER */}
      <section className="ai-section">
        <div className="ai-grid">
          <div className="ai-content">
            <div className="section-eyebrow" style={{ textAlign: 'left', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>AI-Powered</div>
            <h2>Meet WorkNest's AI Recruiter</h2>
            <p>Let our intelligent assistant handle the heavy lifting — from shortlisting candidates to scheduling interviews, it's like having a full recruiting team in your pocket.</p>
            <div className="ai-feature">
              <div className="ai-feature-icon"><svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg></div>
              <div><h4>Smart Candidate Matching</h4><p>AI ranks candidates based on skills, experience, and culture fit — not just keywords.</p></div>
            </div>
            <div className="ai-feature">
              <div className="ai-feature-icon"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
              <div><h4>Instant Job Alerts</h4><p>Candidates receive real-time notifications the moment a matching role is posted.</p></div>
            </div>
          </div>
          
          <div className="ai-visual">
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,.5)', letterSpacing: '1px', marginBottom: '16px' }}>WORKNEST AI RECRUITER</p>
            <div className="chat-row"><div className="chat-bubble system">🤖 Found 24 candidates matching your React + Node.js criteria. Shall I shortlist the top 5?</div></div>
            <div className="chat-row right"><div className="chat-bubble user">Yes, show me the top 5 with 3+ years experience</div></div>
            <div className="chat-row"><div className="chat-bubble system">✅ Here's your qualified candidates list — sorted by relevance score.</div></div>
            <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: '12px', padding: '14px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: 'white' }}>AK</div>
                <div><div style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>Arjun Kumar</div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,.5)' }}>4 yrs · React, Node, MongoDB</div></div>
                <div style={{ marginLeft: 'auto', background: 'rgba(43,168,125,.25)', color: 'var(--green-mid)', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>98% match</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', background: '#7C3AED', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: 'white' }}>PS</div>
                <div><div style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>Priya Sharma</div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,.5)' }}>5 yrs · React, Express, AWS</div></div>
                <div style={{ marginLeft: 'auto', background: 'rgba(43,168,125,.25)', color: 'var(--green-mid)', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>95% match</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOB OF THE DAY */}
      <section className="jobs-section">
        <div className="section-eyebrow">Marketplace</div>
        <h2 className="section-title">Job of the Day</h2>
        <p className="section-sub">Freshly posted opportunities from top companies — updated every morning.</p>
        
        <div className="filter-tabs">
          {['All', 'Design', 'Finance', 'Technology', 'Marketing'].map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: 'var(--text-muted)' }}>
            Loading job opportunities...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '15px', color: 'var(--text-muted)' }}>
            No jobs found in this category.
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <div key={job._id} className="job-card visible-animated" onClick={() => navigate(`/jobs/${job._id}`)}>
                <div className="job-card-top">
                  <div className="company-logo-sm" style={{ background: job.companyLogo || '#1A7A5E' }}>
                    {job.company.substring(0, 2)}
                  </div>
                  <span className="job-badge">{job.type}</span>
                </div>
                <h3>{job.title}</h3>
                <p className="company">{job.company}</p>
                <div className="job-meta">
                  <div className="meta-tag">⏰ {job.jobDuration || 'Full-time'}</div>
                  <div className="meta-tag">📍 {job.location}</div>
                  <div className="meta-tag">🎓 {job.experience}</div>
                </div>
                <div className="job-card-bottom">
                  <div className="salary">{job.salary}</div>
                  <button className="apply-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleApplyClick(job._id);
                  }}>Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button className="btn-outline" style={{ padding: '12px 36px', fontSize: '15px' }} onClick={() => navigate('/jobs')}>
            Explore More Jobs
          </button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="section-eyebrow">Testimonials</div>
        <h2 className="section-title">Quotes from Our Users</h2>
        <p className="section-sub">See what job seekers and companies say about hiring on WorkNest.</p>
        
        <div className="testimonial-card">
          <div className="quote-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7A5E" strokeWidth="2.5">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
            </svg>
          </div>
          <blockquote>
            "{currentTestimonial.quote}"
          </blockquote>
          <div className="testimonial-author">
            <div className="author-avatar" style={{ background: currentTestimonial.avatarBg }}>
              {currentTestimonial.avatar}
            </div>
            <div>
              <div className="author-name">{currentTestimonial.name}</div>
              <div className="author-role">{currentTestimonial.role}</div>
            </div>
          </div>
        </div>
        
        <div className="dot-nav">
          {testimonials.map((_, idx) => (
            <span
              key={idx}
              className={testimonialIndex === idx ? 'active' : ''}
              onClick={() => setTestimonialIndex(idx)}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <h2>Ready to Get Your Dream Job?<svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></h2>
        <button className="btn-green" style={{ fontSize: '16px', padding: '14px 36px', whiteSpace: 'nowrap', flexShrink: 0 }} onClick={() => navigate('/register')}>
          Register Here Now →
        </button>
      </div>
    </div>
  );
};

export default Home;
