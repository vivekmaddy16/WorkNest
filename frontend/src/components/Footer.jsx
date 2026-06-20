import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo">WorkNest ●</div>
          <p>The next step in your career journey. WorkNest bridges top talent with great companies, making hiring smarter for everyone.</p>
          <div className="social-row">
            <a className="social-btn" href="#" aria-label="LinkedIn">in</a>
            <a className="social-btn" href="#" aria-label="Twitter">tw</a>
            <a className="social-btn" href="#" aria-label="GitHub">gh</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/jobs">Browse Jobs</Link></li>
            <li><Link to="/post-job">Post a Job</Link></li>
            <li><a href="#">AI Recruiter</a></li>
            <li><a href="#">Companies</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Resume Builder</a></li>
            <li><a href="#">Career Guide</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Help Center</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} WorkNest. All rights reserved.</p>
        <p>Built with ❤️ for Indian job seekers</p>
      </div>
    </footer>
  );
};

export default Footer;
