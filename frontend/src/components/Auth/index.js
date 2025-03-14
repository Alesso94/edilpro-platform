import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaIdCard, FaUserTie, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import './Auth.css';

const Auth = ({ onLogin }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.redirectTo || '/projects';
    const redirectMessage = location.state?.message;
    
    const [isLogin, setIsLogin] = useState(true);
    const [showAdminCode, setShowAdminCode] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        registrationNumber: '',
        professionalCategory: '',
        adminCode: ''
    });
    const [error, setError] = useState('');
    const [notification, setNotification] = useState(redirectMessage || '');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (isLogin) {
                const response = await axios.post('http://localhost:3001/api/users/login', {
                    email: formData.email,
                    password: formData.password
                });
                
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                if (response.data.user.isAdmin) {
                    localStorage.setItem('isAdmin', 'true');
                }
                
                if (onLogin) {
                    onLogin(response.data.user);
                }
                
                if (redirectTo) {
                    navigate(redirectTo);
                } else if (response.data.user.isAdmin) {
                    navigate('/admin');
                } else {
                    navigate('/projects');
                }
            } else {
                const userData = {
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    registrationNumber: formData.registrationNumber,
                    professionalCategory: formData.professionalCategory
                };

                if (showAdminCode) {
                    userData.adminCode = formData.adminCode;
                }

                const response = await axios.post('http://localhost:3001/api/users', userData);
                
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                if (response.data.user.isAdmin) {
                    localStorage.setItem('isAdmin', 'true');
                }
                
                if (onLogin) {
                    onLogin(response.data.user);
                }

                navigate('/projects');
            }
        } catch (error) {
            console.error('Auth error:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Errore durante l\'autenticazione');
            } else {
                setError('Errore durante l\'autenticazione. Riprova più tardi.');
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <FaUserTie className="auth-icon" />
                    <h2>{isLogin ? 'Accedi' : 'Registrati'}</h2>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                {notification && <div className="notification-message">{notification}</div>}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label>Nome Completo</label>
                                <div className="input-with-icon">
                                    <FaUserTie className="input-icon" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Es: Arch. Mario Rossi"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Numero Iscrizione Albo</label>
                                <div className="input-with-icon">
                                    <FaIdCard className="input-icon" />
                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        value={formData.registrationNumber}
                                        onChange={handleInputChange}
                                        placeholder="Inserisci il numero di iscrizione all'albo"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Categoria Professionale</label>
                                <div className="input-with-icon">
                                    <FaUserTie className="input-icon" />
                                    <select
                                        name="professionalCategory"
                                        value={formData.professionalCategory}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Seleziona una categoria</option>
                                        <option value="architetto">Architetto</option>
                                        <option value="ingegnere">Ingegnere</option>
                                        <option value="geometra">Geometra</option>
                                        <option value="perito">Perito</option>
                                        <option value="altro">Altro</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                    
                    <div className="form-group">
                        <label>Email</label>
                        <div className="input-with-icon">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="La tua email"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <FaLock className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="La tua password"
                                required
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="admin-option">
                            <button
                                type="button"
                                className={`admin-btn ${showAdminCode ? 'active' : ''}`}
                                onClick={() => setShowAdminCode(!showAdminCode)}
                            >
                                <FaShieldAlt />
                                Registrati come Admin
                            </button>
                        </div>
                    )}

                    {showAdminCode && !isLogin && (
                        <div className="form-group">
                            <label>Codice Admin</label>
                            <div className="input-with-icon">
                                <FaShieldAlt className="input-icon" />
                                <input
                                    type="password"
                                    name="adminCode"
                                    value={formData.adminCode}
                                    onChange={handleInputChange}
                                    placeholder="Inserisci il codice admin"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="auth-submit">
                        {isLogin ? 'Accedi' : 'Registrati'}
                    </button>
                </form>

                <div className="auth-switch">
                    <p>
                        {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="switch-btn"
                            type="button"
                        >
                            {isLogin ? 'Registrati' : 'Accedi'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth; 