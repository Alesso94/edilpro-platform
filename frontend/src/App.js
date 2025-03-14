import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Auth from './components/Auth';
import Projects from './components/Projects';
import ProjectDetails from './components/ProjectDetails';
import Chat from './components/Chat';
import Professionals from './components/Professionals';
import AdminPanel from './components/AdminPanel';
import EmailVerification from './components/EmailVerification';
import ProfessionalRegistration from './components/ProfessionalRegistration';
import ProfessionalsList from './components/ProfessionalsList';
import ProfessionalProfile from './components/ProfessionalProfile';
import Navbar from './components/Navbar';
import TestConnection from './components/TestConnection';
import QuotesList from './components/QuotesList';
import QuoteRequest from './components/QuoteRequest';
import QuoteDetail from './components/QuoteDetail';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth register />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/professional-registration" element={<ProfessionalRegistration />} />
          <Route path="/professionals" element={<ProfessionalsList />} />
          <Route path="/professionals/:id" element={<ProfessionalProfile />} />
          <Route path="/test-connection" element={<TestConnection />} />
          <Route path="/quotes" element={<QuotesList />} />
          <Route path="/quotes/new" element={<QuoteRequest />} />
          <Route path="/quotes/new/:professionalId" element={<QuoteRequest />} />
          <Route path="/quotes/:id" element={<QuoteDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;