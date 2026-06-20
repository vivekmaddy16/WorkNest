import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav>
      <div className="nav-logo" onClick={() => navigate('/')}>
        WorkNest <span className="dot"></span>
      </div>

      {/* Mobile hamburger */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Platform</Link></li>
        <li><Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Browse Jobs</Link></li>
        {userInfo && (
          <li><Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link></li>
        )}
      </ul>

      <div className={`nav-right ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {userInfo ? (
          <>
            <Link
              to="/profile"
              className="nav-user-info"
              onClick={() => setMobileMenuOpen(false)}
              style={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              Hi, {userInfo.name} ({userInfo.role})
            </Link>
            {userInfo.role === 'employer' && (
              <button className="btn-green" onClick={() => { navigate('/post-job'); setMobileMenuOpen(false); }}>Post a Job</button>
            )}
            <button className="btn-outline" onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <button className="btn-outline" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Log In</button>
            <button className="btn-green" onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
