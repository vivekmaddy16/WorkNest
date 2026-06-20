import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIRecruiter from './components/AIRecruiter';
import Home from './pages/Home';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import PostJob from './pages/PostJob';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('userInfo');
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('userInfo', JSON.stringify(user));
    setUserInfo(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  return (
    <Router>
      <ToastProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar userInfo={userInfo} onLogout={handleLogout} />
          
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<JobListings />} />
              <Route path="/jobs/:id" element={<JobDetails userInfo={userInfo} />} />
              <Route path="/login" element={<Login userInfo={userInfo} onLogin={handleLogin} />} />
              <Route path="/register" element={<Register userInfo={userInfo} onLogin={handleLogin} />} />
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute userInfo={userInfo} requiredRole="employer">
                    <PostJob userInfo={userInfo} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute userInfo={userInfo}>
                    <Dashboard userInfo={userInfo} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute userInfo={userInfo}>
                    <Profile userInfo={userInfo} />
                  </ProtectedRoute>
                }
              />
              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Footer />
          <AIRecruiter />
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;
