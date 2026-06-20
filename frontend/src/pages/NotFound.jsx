import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-description">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn-green" style={{ padding: '12px 28px', fontSize: '15px' }}>
            Back to Home
          </Link>
          <Link to="/jobs" className="btn-outline" style={{ padding: '12px 28px', fontSize: '15px' }}>
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
