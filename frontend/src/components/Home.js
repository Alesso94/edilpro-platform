import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaBuilding, FaUsers, FaFileAlt, FaArrowRight } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleStartNow = () => {
        navigate('/auth');
    };

    return (
        <div className="home">
            <nav className="navbar">
                <div className="navbar-content">
                    <Link to="/" className="logo">edilpro</Link>
                    <div className="auth-button-container">
                        <Link to="/auth" className="auth-button">
                            <FaUserCircle className="auth-icon" />
                            <span>Area Professionisti</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-content">
                    <h1>La piattaforma per i professionisti dell'edilizia</h1>
                    <p>Gestisci progetti, collabora con altri professionisti e ottimizza il tuo lavoro</p>
                    <div className="hero-buttons">
                        <button onClick={handleStartNow} className="primary-btn">
                            Inizia Ora
                        </button>
                        <button className="secondary-btn">
                            Scopri di più
                        </button>
                    </div>
                </div>
            </section>

            <section className="stats">
                <div className="stats-container">
                    <div className="stat-item">
                        <FaBuilding className="stat-icon" />
                        <div className="stat-number">500+</div>
                        <div className="stat-label">Progetti Completati</div>
                    </div>
                    <div className="stat-item">
                        <FaUsers className="stat-icon" />
                        <div className="stat-number">1000+</div>
                        <div className="stat-label">Professionisti</div>
                    </div>
                    <div className="stat-item">
                        <FaFileAlt className="stat-icon" />
                        <div className="stat-number">5000+</div>
                        <div className="stat-label">Documenti Gestiti</div>
                    </div>
                </div>
            </section>

            <section className="services">
                <h2>I Nostri Servizi</h2>
                <div className="services-grid">
                    <div className="service-card">
                        <FaBuilding className="service-icon" />
                        <h3>Gestione Progetti</h3>
                        <p>Organizza e monitora i tuoi progetti edilizi in modo efficiente</p>
                    </div>
                    <div className="service-card">
                        <FaUsers className="service-icon" />
                        <h3>Collaborazione</h3>
                        <p>Collabora con altri professionisti in tempo reale</p>
                    </div>
                    <div className="service-card">
                        <FaFileAlt className="service-icon" />
                        <h3>Gestione Documenti</h3>
                        <p>Archivia e gestisci documenti e progetti CAD in modo sicuro</p>
                    </div>
                </div>
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