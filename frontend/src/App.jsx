import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
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
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar userInfo={userInfo} onLogout={handleLogout} />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/jobs/:id" element={<JobDetails userInfo={userInfo} />} />
            <Route path="/login" element={<Login userInfo={userInfo} onLogin={handleLogin} />} />
            <Route path="/register" element={<Register userInfo={userInfo} onLogin={handleLogin} />} />
            <Route path="/post-job" element={<PostJob userInfo={userInfo} />} />
            <Route path="/dashboard" element={<Dashboard userInfo={userInfo} />} />
          </Routes>
        </main>
        
        <Footer />
        <AIRecruiter />
      </div>
    </Router>
  );
}

export default App;
