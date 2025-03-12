import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Auth from './components/Auth';
import Projects from './components/Projects';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/auth" 
          element={
            !user ? (
              <Auth onLogin={handleLogin} />
            ) : (
              <Navigate to="/projects" replace />
            )
          } 
        />
        <Route 
          path="/projects" 
          element={
            user ? (
              <Projects user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;