import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const TestConnection = () => {
  const [status, setStatus] = useState('Verifica connessione...');
  const [professionals, setProfessionals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test della route di base
        const testResponse = await axios.get(`${config.API_URL}/test`);
        setStatus(`Connessione al backend riuscita: ${testResponse.data.message}`);
        
        // Test della route dei professionisti
        const profResponse = await axios.get(`${config.API_URL}/api/professionals`);
        setProfessionals(profResponse.data);
      } catch (err) {
        console.error('Errore di connessione:', err);
        setStatus('Errore di connessione al backend');
        setError(err.message);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Test Connessione Backend</h2>
      <div style={{ 
        padding: '15px', 
        backgroundColor: error ? '#ffebee' : '#e8f5e9', 
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <h3>Stato: {status}</h3>
        {error && (
          <div>
            <p style={{ color: 'red' }}>Dettagli errore: {error}</p>
            <p>Verifica che:</p>
            <ul>
              <li>Il server backend sia in esecuzione sulla porta 3002</li>
              <li>Non ci siano problemi di CORS</li>
              <li>L'URL del backend sia corretto nel file config.js</li>
            </ul>
          </div>
        )}
      </div>

      {professionals.length > 0 ? (
        <div>
          <h3>Professionisti caricati dal backend:</h3>
          <ul>
            {professionals.map((prof, index) => (
              <li key={prof._id || index}>
                <strong>{prof.profession}</strong> - {prof.company || 'Libero professionista'} 
                <br />
                <em>Specializzazioni: {prof.specializations}</em>
                <br />
                Esperienza: {prof.yearsOfExperience} anni
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Nessun professionista caricato o in attesa di risposta...</p>
      )}
    </div>
  );
};

export default TestConnection; 