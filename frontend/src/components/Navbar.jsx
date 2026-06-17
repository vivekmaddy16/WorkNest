import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav>
      <div className="nav-logo" onClick={() => navigate('/')}>
        WorkNest <span className="dot"></span>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Platform</Link></li>
        <li><Link to="/jobs">Browse Jobs</Link></li>
        {userInfo && (
          <li><Link to="/dashboard">Dashboard</Link></li>
        )}
      </ul>
      <div className="nav-right">
        {userInfo ? (
          <>
            <span className="nav-user-info">Hi, {userInfo.name} ({userInfo.role})</span>
            {userInfo.role === 'employer' && (
              <button className="btn-green" onClick={() => navigate('/post-job')}>Post a Job</button>
            )}
            <button className="btn-outline" onClick={onLogout}>Log Out</button>
          </>
        ) : (
          <>
            <button className="btn-outline" onClick={() => navigate('/login')}>Log In</button>
            <button className="btn-green" onClick={() => navigate('/login?redirect=post-job')}>Post a Job</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
