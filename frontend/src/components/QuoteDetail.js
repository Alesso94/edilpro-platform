import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaFileInvoiceDollar, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaClock, 
  FaCheckCircle, 
  FaHourglass, 
  FaTimesCircle,
  FaPaperclip,
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaUser
} from 'react-icons/fa';
import config from '../config';
import './QuoteDetail.css';

const API_URL = config.API_URL;

const QuoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/quotes/${id}`);
        setQuote(response.data);
        
        // Se c'è un professionista associato, carica i suoi dati
        if (response.data.professionalId) {
          const profResponse = await axios.get(`${API_URL}/api/professionals/${response.data.professionalId}`);
          setProfessional(profResponse.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Errore nel recupero del preventivo:', err);
        setError('Impossibile caricare i dettagli del preventivo. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuote();
  }, [id]);
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'in_progress':
        return <FaHourglass className="status-icon in-progress" />;
      case 'completed':
        return <FaCheckCircle className="status-icon completed" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon rejected" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'In attesa';
      case 'in_progress':
        return 'In elaborazione';
      case 'completed':
        return 'Completato';
      case 'rejected':
        return 'Rifiutato';
      default:
        return 'Sconosciuto';
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="quote-detail-container">
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Caricamento dettagli preventivo...</p>
        </div>
      </div>
    );
  }
  
  if (error || !quote) {
    return (
      <div className="quote-detail-container">
        <div className="error-message">
          <p>{error || 'Preventivo non trovato'}</p>
          <button onClick={() => navigate('/quotes')}>
            Torna all'elenco dei preventivi
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="quote-detail-container">
      <div className="quote-detail-header">
        <Link to="/quotes" className="back-link">
          <FaArrowLeft /> Torna all'elenco
        </Link>
        <div className="quote-status">
          {getStatusIcon(quote.status)}
          <span>{getStatusText(quote.status)}</span>
        </div>
      </div>
      
      <div className="quote-detail-title">
        <h2><FaFileInvoiceDollar /> {quote.title}</h2>
        <p className="quote-date">Richiesto il {formatDate(quote.createdAt)}</p>
      </div>
      
      <div className="quote-detail-content">
        <div className="quote-info-section">
          <h3>Dettagli della richiesta</h3>
          
          <div className="quote-info-grid">
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <strong>Località</strong>
                <p>{quote.location}</p>
              </div>
            </div>
            
            <div className="info-item">
              <FaMoneyBillWave className="info-icon" />
              <div>
                <strong>Budget stimato</strong>
                <p>{quote.budget}</p>
              </div>
            </div>
            
            <div className="info-item">
              <FaCalendarAlt className="info-icon" />
              <div>
                <strong>Tempistiche</strong>
                <p>{quote.timeline}</p>
              </div>
            </div>
          </div>
          
          <div className="quote-description">
            <h4>Descrizione</h4>
            <p>{quote.description}</p>
          </div>
          
          {quote.attachments && quote.attachments.length > 0 && (
            <div className="quote-attachments">
              <h4>Allegati</h4>
              <ul>
                {quote.attachments.map((file, index) => (
                  <li key={index}>
                    <FaPaperclip /> {file}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {professional && (
          <div className="professional-info-section">
            <h3>Professionista</h3>
            <div className="professional-card">
              <div className="professional-header">
                <div className="professional-avatar">
                  <FaUser />
                </div>
                <div>
                  <h4>{professional.profession}</h4>
                  <p>{professional.company}</p>
                </div>
              </div>
              
              <div className="professional-contact">
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <a href={`mailto:${professional.email}`}>{professional.email}</a>
                </div>
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <a href={`tel:${professional.phone}`}>{professional.phone}</a>
                </div>
              </div>
              
              <Link to={`/professionals/${professional._id}`} className="view-profile-btn">
                Visualizza profilo completo
              </Link>
            </div>
          </div>
        )}
        
        <div className="quote-responses-section">
          <h3>Risposte ricevute</h3>
          
          {quote.responses.length === 0 ? (
            <div className="no-responses">
              <p>Non hai ancora ricevuto risposte a questa richiesta di preventivo.</p>
              {quote.status === 'pending' && (
                <p className="waiting-message">I professionisti stanno valutando la tua richiesta.</p>
              )}
            </div>
          ) : (
            <div className="responses-list">
              {quote.responses.map((response, index) => (
                <div key={index} className="response-card">
                  <div className="response-header">
                    <h4>Preventivo {index + 1}</h4>
                    <p className="response-date">Ricevuto il {formatDate(response.createdAt)}</p>
                  </div>
                  
                  <div className="response-details">
                    <div className="response-amount">
                      <strong>Importo proposto:</strong>
                      <span className="amount">{formatCurrency(response.amount)}</span>
                    </div>
                    
                    <div className="response-time">
                      <strong>Tempo stimato:</strong>
                      <span>{response.estimatedTime}</span>
                    </div>
                    
                    <div className="response-description">
                      <strong>Descrizione:</strong>
                      <p>{response.description}</p>
                    </div>
                  </div>
                  
                  <div className="response-actions">
                    <button className="accept-btn">Accetta preventivo</button>
                    <button className="contact-btn">Contatta professionista</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteDetail; 