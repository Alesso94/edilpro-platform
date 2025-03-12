import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaLock } from 'react-icons/fa';
import axios from 'axios';
import './Auth.css';

const Auth = ({ onLogin }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        profession: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${endpoint}`, formData);
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                onLogin(response.data.user);
                navigate('/projects');
            } else {
                setError('Registrazione completata. Effettua il login per continuare.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Si è verificato un errore');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <FaUserCircle className="auth-icon" />
                    <h2>{isLogin ? 'Accedi' : 'Registrati'}</h2>
                    <p>Area riservata ai professionisti</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label>Nome Completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Es: Arch. Mario Rossi"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Professione</label>
                                <select
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleziona professione</option>
                                    <option value="architect">Architetto</option>
                                    <option value="engineer">Ingegnere</option>
                                    <option value="surveyor">Geometra</option>
                                </select>
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
                                onChange={handleChange}
                                placeholder="La tua email professionale"
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
                                onChange={handleChange}
                                placeholder="La tua password"
                                required
                            />
                        </div>
                    </div>

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
