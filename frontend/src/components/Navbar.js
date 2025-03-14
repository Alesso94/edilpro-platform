import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaProjectDiagram, FaUserTie, FaCalculator } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === 'admin');
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    navigate('/');
  };

  const renderNavLinks = () => {
    if (isAuthenticated) {
      return (
        <>
          <li className="nav-item">
            <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon-wrapper"><FaProjectDiagram className="nav-icon" /></span> Progetti
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/professionals" className={({ isActive }) => isActive ? "nav-link professionals-link active" : "nav-link professionals-link"}>
              <span className="icon-wrapper"><FaUserTie className="nav-icon" /></span> Professionisti
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/quotes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon-wrapper"><FaCalculator className="nav-icon" /></span> Preventivi
            </NavLink>
          </li>
          {isAdmin && (
            <li className="nav-item">
              <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Admin
              </NavLink>
            </li>
          )}
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link logout-btn">
              <span className="icon-wrapper"><FaSignOutAlt className="nav-icon" /></span> Logout
            </button>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon-wrapper"><FaHome className="nav-icon" /></span> Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/professionals" className={({ isActive }) => isActive ? "nav-link professionals-link active" : "nav-link professionals-link"}>
              <span className="icon-wrapper"><FaUserTie className="nav-icon" /></span> Professionisti
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/quotes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon-wrapper"><FaCalculator className="nav-icon" /></span> Preventivi
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon-wrapper"><FaSignInAlt className="nav-icon" /></span> Login
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="icon-wrapper"><FaUserPlus className="nav-icon" /></span> Registrati
            </NavLink>
          </li>
        </>
      );
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          Edilizia Platform
        </NavLink>
        <ul className="nav-menu">
          {renderNavLinks()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 