import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUserTie, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaIdCard, 
  FaGraduationCap, 
  FaTools, 
  FaCalendarAlt,
  FaArrowLeft
} from 'react-icons/fa';
import './ProfessionalProfile.css';
import config from '../config';

// Utilizzo l'URL dal file di configurazione
const API_URL = config.API_URL;

const ProfessionalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/professionals/${id}`);
        setProfessional(response.data);
        setError(null);
      } catch (err) {
        console.error('Errore nel recupero del professionista:', err);
        setError('Impossibile caricare il profilo del professionista. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  if (loading) {
    return (
      <div className="professional-profile-container">
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Caricamento profilo professionista...</p>
        </div>
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="professional-profile-container">
        <div className="error-message">
          <p>{error || 'Professionista non trovato'}</p>
          <button onClick={() => navigate('/professionals')}>
            Torna all'elenco dei professionisti
          </button>
        </div>
      </div>
    );
  }

  // Formatta la data di registrazione
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  return (
    <div className="professional-profile-container">
      <div className="profile-header">
        <Link to="/professionals" className="back-link">
          <FaArrowLeft /> Torna all'elenco
        </Link>
        <h2>Profilo Professionista</h2>
      </div>

      <div className="profile-card">
        <div className="profile-main">
          <div className="profile-avatar">
            <FaUserTie />
          </div>
          <div className="profile-title">
            <h1>{professional.profession}</h1>
            {professional.company && (
              <p className="company">
                <FaBuilding /> {professional.company}
              </p>
            )}
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h3>Informazioni di contatto</h3>
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <strong>Indirizzo</strong>
                <p>{professional.address}</p>
              </div>
            </div>
            <div className="info-item">
              <FaPhone className="info-icon" />
              <div>
                <strong>Telefono</strong>
                <p>{professional.phone}</p>
              </div>
            </div>
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div>
                <strong>Email</strong>
                <p>{professional.email}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Qualifiche professionali</h3>
            <div className="info-item">
              <FaIdCard className="info-icon" />
              <div>
                <strong>Numero Iscrizione Albo</strong>
                <p>{professional.licenseNumber}</p>
              </div>
            </div>
            <div className="info-item">
              <FaGraduationCap className="info-icon" />
              <div>
                <strong>Formazione</strong>
                <p>{professional.education}</p>
              </div>
            </div>
            <div className="info-item">
              <FaCalendarAlt className="info-icon" />
              <div>
                <strong>Anni di esperienza</strong>
                <p>{professional.yearsOfExperience} anni</p>
              </div>
            </div>
          </div>

          <div className="profile-section full-width">
            <h3>Specializzazioni</h3>
            <div className="specializations-list">
              <FaTools className="info-icon" />
              <p>{professional.specializations}</p>
            </div>
          </div>

          <div className="profile-section full-width">
            <h3>Biografia professionale</h3>
            <div className="bio">
              <p>{professional.bio}</p>
            </div>
          </div>

          <div className="profile-section full-width">
            <h3>Informazioni aggiuntive</h3>
            <div className="info-item">
              <FaCalendarAlt className="info-icon" />
              <div>
                <strong>Professionista dal</strong>
                <p>{formatDate(professional.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <a href={`mailto:${professional.email}`} className="contact-btn primary">
            <FaEnvelope /> Contatta via Email
          </a>
          <a href={`tel:${professional.phone}`} className="contact-btn">
            <FaPhone /> Chiama
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile; 