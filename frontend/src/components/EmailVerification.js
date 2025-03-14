import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './EmailVerification.css';

const EmailVerification = () => {
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyEmail = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Token di verifica mancante');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3001/api/users/verify-email?token=${token}`);
                setStatus('success');
                setMessage(response.data.message);
                setTimeout(() => {
                    navigate('/auth');
                }, 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Errore durante la verifica');
            }
        };

        verifyEmail();
    }, [location.search, navigate]);

    const handleResendVerification = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post('http://localhost:3001/api/users/resend-verification', { email });
            setMessage('Email di verifica reinviata con successo');
            setEmail('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Errore nell\'invio dell\'email');
        }
    };

    return (
        <div className="email-verification">
            <div className="verification-container">
                <div className={`verification-status ${status}`}>
                    {status === 'verifying' && (
                        <>
                            <div className="loading-spinner"></div>
                            <h2>Verifica in corso...</h2>
                        </>
                    )}
                    
                    {status === 'success' && (
                        <>
                            <div className="success-icon">✓</div>
                            <h2>Verifica Completata!</h2>
                            <p>{message}</p>
                            <p>Sarai reindirizzato alla pagina di login...</p>
                        </>
                    )}
                    
                    {status === 'error' && (
                        <>
                            <div className="error-icon">✕</div>
                            <h2>Verifica Fallita</h2>
                            <p>{message}</p>
                            
                            <div className="resend-form">
                                <h3>Richiedi una nuova email di verifica</h3>
                                <form onSubmit={handleResendVerification}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Inserisci la tua email"
                                        required
                                    />
                                    <button type="submit">
                                        Reinvia Email
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerification; 