import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Profile = ({ userInfo }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setProfile(data);
      } catch {
        // Fallback to local info
        setProfile(userInfo);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userInfo, navigate]);

  if (loading) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', padding: '100px' }}>
        <div className="skeleton-line" style={{ width: '200px', margin: '0 auto 16px' }}></div>
        <div className="skeleton-line" style={{ width: '300px', margin: '0 auto' }}></div>
      </div>
    );
  }

  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="dashboard-container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="profile-card">
          <div className="profile-avatar">{initials}</div>
          <h2 className="profile-name">{profile?.name}</h2>
          <span className={`profile-role-badge role-${profile?.role}`}>
            {profile?.role === 'employer' ? '🏢 Employer' : '👤 Candidate'}
          </span>

          <div className="profile-details">
            <div className="profile-detail-row">
              <span className="profile-detail-label">Email</span>
              <span className="profile-detail-value">{profile?.email}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Account Type</span>
              <span className="profile-detail-value" style={{ textTransform: 'capitalize' }}>{profile?.role}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Member Since</span>
              <span className="profile-detail-value">
                {profile?.createdAt 
                  ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
            <button className="btn-green" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
            {profile?.role === 'employer' && (
              <button className="btn-outline" onClick={() => navigate('/post-job')}>
                Post a Job
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
