import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaBuilding, FaUsers, FaFileAlt, FaArrowRight, FaCheck, FaEuroSign, FaFile, FaCreditCard, FaCalendar } from 'react-icons/fa';
import './Home.css';
import heroImage from '../assets/images/ProgettazioneEdilizia.jpg';

const Home = () => {
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState(null);

    const handleStartNow = () => {
        navigate('/auth');
    };

    const handleStartChat = (e) => {
        e.preventDefault(); // Previene comportamenti indesiderati
        console.log('Clicking chat button'); // Debug log
        
        try {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            
            if (userStr && token) {
                console.log('User is authenticated, navigating to chat');
                navigate('/chat');
            } else {
                console.log('User is not authenticated, navigating to auth');
                navigate('/auth', { 
                    state: { 
                        redirectTo: '/chat',
                        message: 'Effettua l\'accesso per utilizzare la chat' 
                    } 
                });
            }
        } catch (error) {
            console.error('Error in handleStartChat:', error);
            navigate('/auth', { 
                state: { 
                    redirectTo: '/chat',
                    message: 'Effettua l\'accesso per utilizzare la chat' 
                } 
            });
        }
    };

    const scrollToServices = () => {
        const servicesSection = document.querySelector('.services');
        servicesSection.scrollIntoView({ behavior: 'smooth' });
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
    };

    const handleProfessionalsClick = () => {
        navigate('/professionals');
    };

    // Nuove funzioni per collegare i pulsanti
    const handleProjectsClick = () => {
        // Controlla se l'utente è autenticato
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/projects');
        } else {
            navigate('/auth', { 
                state: { 
                    redirectTo: '/projects',
                    message: 'Effettua l\'accesso per gestire i tuoi progetti' 
                } 
            });
        }
    };

    const handleDocumentsClick = () => {
        // Controlla se l'utente è autenticato
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/projects'); // Reindirizza ai progetti dove si possono gestire i documenti
        } else {
            navigate('/auth', { 
                state: { 
                    redirectTo: '/projects',
                    message: 'Effettua l\'accesso per gestire i tuoi documenti' 
                } 
            });
        }
    };

    const handleConsultingClick = () => {
        navigate('/professionals'); // Reindirizza alla pagina dei professionisti per consulenza
    };

    const handleRequestQuote = (type) => {
        // Controlla se l'utente è autenticato
        const token = localStorage.getItem('token');
        if (token) {
            // Reindirizza alla pagina di richiesta preventivo o contatta un professionista
            navigate('/professionals', { 
                state: { 
                    requestType: type
                } 
            });
        } else {
            navigate('/auth', { 
                state: { 
                    redirectTo: '/professionals',
                    message: 'Effettua l\'accesso per richiedere un preventivo' 
                } 
            });
        }
    };

    const handleBookConsultation = () => {
        // Controlla se l'utente è autenticato
        const token = localStorage.getItem('token');
        if (token) {
            // Reindirizza alla pagina di prenotazione consulenza
            navigate('/professionals', { 
                state: { 
                    requestType: 'financing'
                } 
            });
        } else {
            navigate('/auth', { 
                state: { 
                    redirectTo: '/professionals',
                    message: 'Effettua l\'accesso per prenotare una consulenza' 
                } 
            });
        }
    };

    const handleLearnMore = () => {
        // Reindirizza a una pagina informativa sui bonus edilizi
        navigate('/professionals', { 
            state: { 
                requestType: 'bonus'
            } 
        });
    };

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-background" style={{ backgroundImage: `url(${heroImage})` }}>
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-text-container">
                        <h1 className="animate-slide-up">
                            La piattaforma per i professionisti dell'edilizia
                        </h1>
                        <p className="animate-slide-up-delay">
                            Gestisci progetti, collabora con altri professionisti e ottimizza il tuo lavoro
                        </p>
                        <div className="hero-features animate-slide-up-delay-2">
                            <div className="feature-item">
                                <FaCheck className="feature-icon" />
                                <span>Gestione progetti avanzata</span>
                            </div>
                            <div className="feature-item">
                                <FaCheck className="feature-icon" />
                                <span>Collaborazione in tempo reale</span>
                            </div>
                            <div className="feature-item">
                                <FaCheck className="feature-icon" />
                                <span>Documenti e CAD integrati</span>
                            </div>
                        </div>
                        <div className="hero-buttons animate-slide-up-delay-3">
                            <button onClick={handleStartNow} className="primary-btn">
                                Inizia Ora
                                <FaArrowRight className="btn-icon" />
                            </button>
                            <button onClick={scrollToServices} className="secondary-btn">
                                Scopri di più
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats">
                <div className="stats-container">
                    <div className="stat-item clickable" onClick={handleProjectsClick}>
                        <FaBuilding className="stat-icon" />
                        <div className="stat-number">500+</div>
                        <div className="stat-label">Progetti Completati</div>
                    </div>
                    <div className="stat-item clickable" onClick={handleProfessionalsClick}>
                        <FaUsers className="stat-icon" />
                        <div className="stat-number">1000+</div>
                        <div className="stat-label">Professionisti</div>
                    </div>
                    <div className="stat-item clickable" onClick={handleDocumentsClick}>
                        <FaFileAlt className="stat-icon" />
                        <div className="stat-number">5000+</div>
                        <div className="stat-label">Documenti Gestiti</div>
                    </div>
                </div>
            </section>

            <section className="services">
                <h2>I Nostri Servizi</h2>
                <div className="services-grid">
                    <div className="service-card clickable" onClick={handleProjectsClick}>
                        <FaBuilding className="service-icon" />
                        <h3>Gestione Progetti</h3>
                        <p>Organizza e monitora i tuoi progetti edilizi in modo efficiente</p>
                    </div>
                    <div className="service-card clickable" onClick={handleDocumentsClick}>
                        <FaFileAlt className="service-icon" />
                        <h3>Gestione Documenti</h3>
                        <p>Archivia e gestisci documenti e progetti CAD in modo sicuro</p>
                    </div>
                    <div className="service-card clickable" onClick={handleConsultingClick}>
                        <FaUsers className="service-icon" />
                        <h3>Consulenza</h3>
                        <p>Ricevi supporto e consulenza dai nostri professionisti qualificati</p>
                    </div>
                </div>
            </section>

            <section className="public-services">
                <h2>Servizi per il Pubblico</h2>
                <div className="services-tabs">
                    <button 
                        className={`tab-btn ${selectedService === 'documents' ? 'active' : ''}`}
                        onClick={() => handleServiceSelect('documents')}
                    >
                        <FaFile /> Documenti Singoli
                    </button>
                    <button 
                        className={`tab-btn ${selectedService === 'financing' ? 'active' : ''}`}
                        onClick={() => handleServiceSelect('financing')}
                    >
                        <FaEuroSign /> Finanziamenti
                    </button>
                </div>

                {selectedService === 'documents' && (
                    <div className="service-options">
                        <div className="service-card pricing-card">
                            <h3>Documenti Tecnici</h3>
                            <div className="price">da €50</div>
                            <ul className="features-list">
                                <li><FaCheck /> Relazioni Tecniche</li>
                                <li><FaCheck /> Certificazioni</li>
                                <li><FaCheck /> Perizie</li>
                                <li><FaCheck /> Documenti Catastali</li>
                            </ul>
                            <button className="service-btn" onClick={() => handleRequestQuote('technical')}>
                                <FaCreditCard /> Richiedi Preventivo
                            </button>
                        </div>
                        <div className="service-card pricing-card">
                            <h3>Progetti CAD</h3>
                            <div className="price">da €150</div>
                            <ul className="features-list">
                                <li><FaCheck /> Planimetrie</li>
                                <li><FaCheck /> Disegni Tecnici</li>
                                <li><FaCheck /> Modelli 3D</li>
                                <li><FaCheck /> Rendering</li>
                            </ul>
                            <button className="service-btn" onClick={() => handleRequestQuote('cad')}>
                                <FaCreditCard /> Richiedi Preventivo
                            </button>
                        </div>
                    </div>
                )}

                {selectedService === 'financing' && (
                    <div className="service-options">
                        <div className="service-card financing-card">
                            <h3>Finanziamento Progetti</h3>
                            <div className="price">Tassi da 3.5%</div>
                            <ul className="features-list">
                                <li><FaCheck /> Rate Personalizzate</li>
                                <li><FaCheck /> Consulenza Dedicata</li>
                                <li><FaCheck /> Processo Semplificato</li>
                                <li><FaCheck /> Tempi Rapidi</li>
                            </ul>
                            <button className="service-btn" onClick={handleBookConsultation}>
                                <FaCalendar /> Prenota Consulenza
                            </button>
                        </div>
                        <div className="service-card financing-card">
                            <h3>Bonus Edilizi</h3>
                            <div className="price">Consulenza Gratuita</div>
                            <ul className="features-list">
                                <li><FaCheck /> Superbonus 110%</li>
                                <li><FaCheck /> Ecobonus</li>
                                <li><FaCheck /> Bonus Ristrutturazioni</li>
                                <li><FaCheck /> Cessione del Credito</li>
                            </ul>
                            <button className="service-btn" onClick={handleLearnMore}>
                                <FaCalendar /> Scopri di Più
                            </button>
                        </div>
                    </div>
                )}
            </section>

            <section className="cta">
                <div className="cta-content">
                    <h2>Pronto per iniziare?</h2>
                    <p>Unisciti a migliaia di professionisti che hanno già scelto la nostra piattaforma</p>
                    <button onClick={handleStartNow} className="cta-button">
                        Inizia Ora <FaArrowRight style={{ marginLeft: '10px' }} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;



