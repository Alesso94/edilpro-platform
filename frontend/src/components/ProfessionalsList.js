import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserTie, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSearch, FaFilter } from 'react-icons/fa';
import './ProfessionalsList.css';
import config from '../config';

const API_URL = config.API_URL;

const ProfessionalsList = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    profession: '',
    specialization: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/professionals`);
      
      // Normalizza i dati per gestire entrambi i formati
      const normalizedData = response.data.map(prof => {
        // Se i dati sono già nel formato corretto, li restituisce così come sono
        if (prof.profession) {
          return prof;
        }
        
        // Altrimenti, converte dal vecchio formato al nuovo
        return {
          _id: prof._id,
          profession: prof.specialization || 'Professionista',
          specializations: prof.description || '',
          company: prof.name || '',
          address: prof.city || '',
          yearsOfExperience: prof.yearsOfExperience || 0,
          email: prof.email || '',
          phone: prof.phone || ''
        };
      });
      
      setProfessionals(normalizedData);
      setError(null);
    } catch (err) {
      console.error('Errore nel recupero dei professionisti:', err);
      setError('Impossibile caricare l\'elenco dei professionisti. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      profession: '',
      specialization: ''
    });
    setSearchTerm('');
  };

  const filteredProfessionals = professionals.filter(professional => {
    // Filtra per termine di ricerca (nome, professione, specializzazioni)
    const searchMatch = 
      professional.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specializations.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (professional.company && professional.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtra per professione
    const professionMatch = filters.profession === '' || 
      professional.profession.toLowerCase().includes(filters.profession.toLowerCase());
    
    // Filtra per specializzazione
    const specializationMatch = filters.specialization === '' || 
      professional.specializations.toLowerCase().includes(filters.specialization.toLowerCase());
    
    return searchMatch && professionMatch && specializationMatch;
  });

  // Estrai professioni uniche per il filtro
  const uniqueProfessions = [...new Set(professionals.map(p => p.profession))];

  if (loading) {
    return (
      <div className="professionals-list-container">
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Caricamento professionisti...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="professionals-list-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchProfessionals}>Riprova</button>
        </div>
      </div>
    );
  }

  return (
    <div className="professionals-list-container">
      <div className="professionals-header">
        <h2><FaUserTie /> Professionisti</h2>
        <p>Trova il professionista giusto per il tuo progetto</p>
      </div>

      <div className="search-filter-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Cerca per professione, specializzazione..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filtri
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label htmlFor="profession">Professione</label>
            <select
              id="profession"
              name="profession"
              value={filters.profession}
              onChange={handleFilterChange}
            >
              <option value="">Tutte le professioni</option>
              {uniqueProfessions.map((profession, index) => (
                <option key={index} value={profession}>{profession}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="specialization">Specializzazione</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              placeholder="Es. Ristrutturazioni, BIM..."
              value={filters.specialization}
              onChange={handleFilterChange}
            />
          </div>

          <button 
            className="reset-filters-btn"
            onClick={resetFilters}
          >
            Reimposta filtri
          </button>
        </div>
      )}

      {filteredProfessionals.length === 0 ? (
        <div className="no-results">
          <p>Nessun professionista trovato con i criteri di ricerca specificati.</p>
          <button onClick={resetFilters}>Reimposta filtri</button>
        </div>
      ) : (
        <div className="professionals-grid">
          {filteredProfessionals.map(professional => (
            <div key={professional._id} className="professional-card">
              <div className="professional-avatar">
                <FaUserTie />
              </div>
              <div className="professional-info">
                <h3>{professional.profession}</h3>
                {professional.company && (
                  <p className="company">
                    <FaBuilding /> {professional.company}
                  </p>
                )}
                <p className="location">
                  <FaMapMarkerAlt /> {professional.address}
                </p>
                <div className="specializations">
                  <strong>Specializzazioni:</strong>
                  <p>{professional.specializations}</p>
                </div>
                <div className="experience">
                  <strong>Esperienza:</strong>
                  <p>{professional.yearsOfExperience} anni</p>
                </div>
              </div>
              <div className="professional-actions">
                <Link to={`/professionals/${professional._id}`} className="view-profile-btn">
                  Visualizza Profilo
                </Link>
                <a href={`mailto:${professional.email}`} className="contact-btn">
                  <FaEnvelope /> Contatta
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessionalsList; 