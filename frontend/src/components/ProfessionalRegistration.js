import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserTie, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaIdCard, FaGraduationCap, FaTools } from 'react-icons/fa';
import './ProfessionalRegistration.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const ProfessionalRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profession: '',
    company: '',
    address: '',
    phone: '',
    email: '',
    licenseNumber: '',
    education: '',
    specializations: '',
    bio: '',
    yearsOfExperience: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Devi effettuare il login prima di registrarti come professionista');
        setLoading(false);
        return;
      }

      await axios.post(`${API_URL}/api/professionals/register`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/projects');
      }, 3000);
    } catch (err) {
      console.error('Errore nella registrazione del professionista:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Errore nella registrazione. Riprova più tardi.');
      } else {
        setError('Errore nella registrazione. Riprova più tardi.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="professional-registration">
        <div className="success-message">
          <FaUserTie className="success-icon" />
          <h2>Registrazione completata con successo!</h2>
          <p>Sei stato registrato come professionista. Ora puoi accedere a tutte le funzionalità riservate ai professionisti.</p>
          <p>Verrai reindirizzato alla pagina dei progetti tra pochi secondi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="professional-registration">
      <div className="registration-header">
        <FaUserTie className="header-icon" />
        <h2>Registrazione Professionista</h2>
        <p>Compila il modulo per registrarti come professionista e accedere a funzionalità avanzate</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="profession">
            <FaGraduationCap /> Professione
          </label>
          <input
            type="text"
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="Es. Architetto, Ingegnere, Geometra"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">
            <FaBuilding /> Azienda/Studio
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Nome dell'azienda o dello studio"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address">
              <FaMapMarkerAlt /> Indirizzo
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Indirizzo professionale"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <FaPhone /> Telefono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Numero di telefono"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <FaEnvelope /> Email Professionale
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email professionale"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="licenseNumber">
              <FaIdCard /> Numero Iscrizione Albo
            </label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="Numero di iscrizione all'albo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="yearsOfExperience">
              <FaGraduationCap /> Anni di Esperienza
            </label>
            <input
              type="number"
              id="yearsOfExperience"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              placeholder="Anni di esperienza"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="education">
            <FaGraduationCap /> Formazione
          </label>
          <input
            type="text"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            placeholder="Es. Laurea in Architettura, Master in Ingegneria Strutturale"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="specializations">
            <FaTools /> Specializzazioni
          </label>
          <input
            type="text"
            id="specializations"
            name="specializations"
            value={formData.specializations}
            onChange={handleChange}
            placeholder="Es. Ristrutturazioni, Progettazione Strutturale, BIM"
            required
          />
          <small>Separa le specializzazioni con una virgola</small>
        </div>

        <div className="form-group">
          <label htmlFor="bio">Biografia Professionale</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Breve descrizione della tua esperienza professionale"
            rows="4"
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/projects')}
          >
            Annulla
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Registrazione in corso...' : 'Registrati come Professionista'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfessionalRegistration; 