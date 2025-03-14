import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaFileInvoiceDollar, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaClock, 
  FaCheckCircle, 
  FaHourglass, 
  FaTimesCircle 
} from 'react-icons/fa';
import config from '../config';
import './QuotesList.css';

const API_URL = config.API_URL;

const QuotesList = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    fetchQuotes();
  }, []);
  
  const fetchQuotes = async () => {
    setLoading(true);
    try {
      // In un'app reale, qui passeremmo l'ID utente dall'autenticazione
      const response = await axios.get(`${API_URL}/api/quotes?userId=user123`);
      setQuotes(response.data);
      setError(null);
    } catch (err) {
      console.error('Errore nel recupero dei preventivi:', err);
      setError('Impossibile caricare l\'elenco dei preventivi. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };
  
  // Filtra i preventivi in base alla ricerca e al filtro di stato
  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  if (loading) {
    return (
      <div className="quotes-list-container">
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Caricamento preventivi...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="quotes-list-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchQuotes}>Riprova</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="quotes-list-container">
      <div className="quotes-header">
        <div className="quotes-title">
          <h2><FaFileInvoiceDollar /> I Miei Preventivi</h2>
          <p>Gestisci le tue richieste di preventivo</p>
        </div>
        <Link to="/quotes/new" className="new-quote-btn">
          <FaPlus /> Nuovo Preventivo
        </Link>
      </div>
      
      <div className="quotes-filters">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Cerca per titolo, descrizione, località..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="status-filter">
          <FaFilter className="filter-icon" />
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">Tutti gli stati</option>
            <option value="pending">In attesa</option>
            <option value="in_progress">In elaborazione</option>
            <option value="completed">Completati</option>
            <option value="rejected">Rifiutati</option>
          </select>
        </div>
      </div>
      
      {filteredQuotes.length === 0 ? (
        <div className="no-quotes">
          <p>Nessun preventivo trovato.</p>
          <Link to="/quotes/new" className="new-quote-btn-alt">
            Richiedi un nuovo preventivo
          </Link>
        </div>
      ) : (
        <div className="quotes-grid">
          {filteredQuotes.map(quote => (
            <Link to={`/quotes/${quote._id}`} key={quote._id} className="quote-card">
              <div className="quote-status">
                {getStatusIcon(quote.status)}
                <span>{getStatusText(quote.status)}</span>
              </div>
              
              <h3 className="quote-title">{quote.title}</h3>
              
              <div className="quote-details">
                <p className="quote-location">{quote.location}</p>
                <p className="quote-budget">Budget: {quote.budget}</p>
                <p className="quote-timeline">Tempistiche: {quote.timeline}</p>
              </div>
              
              <div className="quote-responses">
                <p>
                  {quote.responses.length === 0 
                    ? 'Nessuna risposta ricevuta' 
                    : `${quote.responses.length} ${quote.responses.length === 1 ? 'risposta' : 'risposte'} ricevute`}
                </p>
              </div>
              
              <div className="quote-date">
                <p>Richiesto il {formatDate(quote.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotesList; 