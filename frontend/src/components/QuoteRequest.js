import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaFileInvoiceDollar, FaUpload, FaTrash, FaInfoCircle } from 'react-icons/fa';
import config from '../config';
import './QuoteRequest.css';

const API_URL = config.API_URL;

const QuoteRequest = () => {
  const navigate = useNavigate();
  const { professionalId } = useParams();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    timeline: '',
    attachments: []
  });
  
  // Carica i dati del professionista se l'ID è fornito
  useEffect(() => {
    if (professionalId) {
      const fetchProfessional = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/professionals/${professionalId}`);
          setProfessional(response.data);
        } catch (err) {
          console.error('Errore nel recupero del professionista:', err);
          setError('Impossibile caricare i dati del professionista.');
        }
      };
      
      fetchProfessional();
    }
  }, [professionalId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    // In un'implementazione reale, qui gestiremmo il caricamento dei file
    // Per ora, simuliamo solo l'aggiunta dei nomi dei file
    const files = Array.from(e.target.files);
    const fileNames = files.map(file => file.name);
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...fileNames]
    }));
  };
  
  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Prepara i dati per l'invio
      const quoteData = {
        ...formData,
        userId: 'user123', // In un'app reale, questo verrebbe dall'autenticazione
        professionalId: professionalId || null
      };
      
      // Invia la richiesta al backend
      await axios.post(`${API_URL}/api/quotes`, quoteData);
      
      setSuccess(true);
      setLoading(false);
      
      // Reindirizza dopo 2 secondi
      setTimeout(() => {
        navigate('/quotes');
      }, 2000);
      
    } catch (err) {
      console.error('Errore nell\'invio del preventivo:', err);
      setError('Si è verificato un errore durante l\'invio della richiesta. Riprova più tardi.');
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="quote-request-container">
        <div className="success-message">
          <h2>Richiesta inviata con successo!</h2>
          <p>La tua richiesta di preventivo è stata inviata. Verrai reindirizzato alla pagina dei preventivi.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="quote-request-container">
      <div className="quote-request-header">
        <h2><FaFileInvoiceDollar /> Richiedi un Preventivo</h2>
        {professional && (
          <p>Professionista selezionato: <strong>{professional.profession}</strong> - {professional.company}</p>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="quote-form">
        <div className="form-group">
          <label htmlFor="title">Titolo del progetto *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Es. Ristrutturazione bagno, Progetto casa..."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descrizione dettagliata *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrivi nel dettaglio il progetto, includendo dimensioni, materiali preferiti, e qualsiasi altra informazione rilevante..."
            rows={5}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="budget">Budget stimato *</label>
            <input
              type="text"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Es. 5000-8000€"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="timeline">Tempistiche *</label>
            <input
              type="text"
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              placeholder="Es. Entro 3 mesi"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Località *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Es. Roma, RM"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="attachments">Allegati (opzionale)</label>
          <div className="file-upload-container">
            <label className="file-upload-btn">
              <FaUpload /> Carica file
              <input
                type="file"
                id="attachments"
                onChange={handleFileChange}
                multiple
                style={{ display: 'none' }}
              />
            </label>
            <span className="file-info">
              <FaInfoCircle /> Puoi caricare foto, planimetrie, o qualsiasi documento utile (max 5MB per file)
            </span>
          </div>
          
          {formData.attachments.length > 0 && (
            <div className="attachments-list">
              <h4>File allegati:</h4>
              <ul>
                {formData.attachments.map((file, index) => (
                  <li key={index}>
                    {file}
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => removeAttachment(index)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            Annulla
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Invio in corso...' : 'Invia richiesta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuoteRequest; 