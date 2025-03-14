import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaFileAlt, FaDownload, FaTrash, FaUpload, FaFilePdf, FaFileImage, FaFileWord, FaFileExcel, FaFilePowerpoint, FaPlus, FaLock, FaUserTie } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './DocumentManager.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Dati fittizi per i documenti
const MOCK_DOCUMENTS = [
  {
    _id: 'doc1',
    originalName: 'Planimetria_Piano_Terra.pdf',
    description: 'Planimetria dettagliata del piano terra',
    category: 'Planimetria',
    size: 2500000,
    mimeType: 'application/pdf',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: { name: 'Mario Rossi', email: 'mario.rossi@example.com' }
  },
  {
    _id: 'doc2',
    originalName: 'Preventivo_Impianto_Elettrico.docx',
    description: 'Preventivo dettagliato per l\'impianto elettrico',
    category: 'Preventivo',
    size: 1200000,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: { name: 'Luigi Bianchi', email: 'luigi.bianchi@example.com' }
  },
  {
    _id: 'doc3',
    originalName: 'Foto_Sopralluogo.jpg',
    description: 'Foto del sopralluogo iniziale',
    category: 'Altro',
    size: 3500000,
    mimeType: 'image/jpeg',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: { name: 'Anna Verdi', email: 'anna.verdi@example.com' }
  },
  {
    _id: 'doc4',
    originalName: 'Progetto_Strutturale.dwg',
    description: 'Disegno CAD del progetto strutturale',
    category: 'Planimetria',
    size: 5800000,
    mimeType: 'application/acad',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: { name: 'Paolo Neri', email: 'paolo.neri@example.com' }
  },
  {
    _id: 'doc5',
    originalName: 'Calcoli_Strutturali.xlsx',
    description: 'Foglio di calcolo per le verifiche strutturali',
    category: 'Altro',
    size: 1800000,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: { name: 'Giulia Bianchi', email: 'giulia.bianchi@example.com' }
  }
];

const DocumentManager = ({ projectId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Altro');
  const [uploading, setUploading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [isProfessional, setIsProfessional] = useState(null);
  const [checkingProfessional, setCheckingProfessional] = useState(true);

  // Verifica se l'utente è un professionista
  const checkProfessionalStatus = useCallback(async () => {
    try {
      setCheckingProfessional(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsProfessional(false);
        setCheckingProfessional(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/documents/check-professional`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setIsProfessional(response.data.isProfessional);
    } catch (err) {
      console.error('Errore nella verifica dello stato professionale:', err);
      setIsProfessional(false);
    } finally {
      setCheckingProfessional(false);
    }
  }, []);

  // Verifica lo stato professionale all'avvio
  useEffect(() => {
    checkProfessionalStatus();
  }, [checkProfessionalStatus]);

  // Recupera i documenti dal server
  const fetchDocuments = useCallback(async () => {
    if (!projectId) {
      console.error('ProjectID non valido:', projectId);
      setError('ID progetto non valido');
      setLoading(false);
      return;
    }

    try {
      console.log('Recupero documenti per il progetto:', projectId);
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token non trovato');
        setError('Autenticazione richiesta. Effettua il login.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/documents/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 5000 // Timeout di 5 secondi
      });
      
      console.log('Documenti recuperati:', response.data);
      setDocuments(response.data);
      setError(null);
      setUseMockData(false);
    } catch (err) {
      console.error('Errore nel recupero dei documenti:', err);
      
      // Se l'utente non è un professionista, mostra un messaggio specifico
      if (err.response && err.response.status === 403 && err.response.data.isProfessional === false) {
        setError('Accesso negato. Solo i professionisti registrati possono accedere ai documenti.');
        setDocuments([]);
        setUseMockData(false);
        return;
      }
      
      // Se il backend non è disponibile, usa i dati fittizi
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout') || err.message.includes('Network Error')) {
        console.log('Utilizzo dati fittizi per i documenti');
        setDocuments(MOCK_DOCUMENTS);
        setUseMockData(true);
        setError('Modalità demo: utilizzo dati fittizi. Il backend non è disponibile.');
      } else if (err.response) {
        console.error('Risposta del server:', err.response.data);
        setError(`Errore ${err.response.status}: ${err.response.data.message || 'Impossibile caricare i documenti'}`);
        
        // Se il progetto non esiste o non è autorizzato, usa i dati fittizi
        if (err.response.status === 404 || err.response.status === 403) {
          console.log('Utilizzo dati fittizi per i documenti');
          setDocuments(MOCK_DOCUMENTS);
          setUseMockData(true);
        }
      } else if (err.request) {
        console.error('Nessuna risposta dal server');
        setError('Modalità demo: utilizzo dati fittizi. Il server non risponde.');
        setDocuments(MOCK_DOCUMENTS);
        setUseMockData(true);
      } else {
        setError('Impossibile caricare i documenti. Riprova più tardi.');
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Carica i documenti all'avvio
  useEffect(() => {
    if (!checkingProfessional) {
      fetchDocuments();
    }
  }, [projectId, fetchDocuments, checkingProfessional]);

  // Gestisce la selezione del file
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Carica il documento
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Seleziona un file da caricare');
      return;
    }

    // Se stiamo usando dati fittizi, simula l'upload
    if (useMockData) {
      setUploading(true);
      
      // Simula il progresso dell'upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          
          // Crea un nuovo documento fittizio
          const newDoc = {
            _id: 'doc' + (documents.length + 1),
            originalName: selectedFile.name,
            description: description || 'Nessuna descrizione',
            category: category,
            size: selectedFile.size,
            mimeType: selectedFile.type,
            createdAt: new Date().toISOString(),
            uploadedBy: { name: 'Utente Demo', email: 'utente@example.com' }
          };
          
          // Aggiungi il documento alla lista
          setDocuments([newDoc, ...documents]);
          
          // Reset form
          setSelectedFile(null);
          setDescription('');
          setCategory('Altro');
          setUploadProgress(0);
          setUploading(false);
          
          // Reset file input
          document.getElementById('file-upload').value = '';
        }
      }, 300);
      
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('description', description);
    formData.append('category', category);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      
      await axios.post(`${API_URL}/api/documents/${projectId}/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      // Reset form
      setSelectedFile(null);
      setDescription('');
      setCategory('Altro');
      setUploadProgress(0);
      
      // Aggiorna la lista dei documenti
      fetchDocuments();
      
      // Reset file input
      document.getElementById('file-upload').value = '';
      
    } catch (err) {
      console.error('Errore durante l\'upload:', err);
      
      if (err.response && err.response.status === 403 && err.response.data.isProfessional === false) {
        setError('Accesso negato. Solo i professionisti registrati possono caricare documenti.');
      } else {
        setError('Errore durante l\'upload. Riprova più tardi.');
      }
    } finally {
      setUploading(false);
    }
  };

  // Scarica un documento
  const handleDownload = async (documentId) => {
    // Se stiamo usando dati fittizi, simula il download
    if (useMockData) {
      alert('Download simulato in modalità demo');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/documents/${projectId}/download/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );

      // Crea un URL per il blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Trova il documento per ottenere il nome originale
      const document = documents.find(doc => doc._id === documentId);
      const fileName = document ? document.originalName : 'download';
      
      // Crea un link temporaneo e simula il click
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // Pulisci
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Errore durante il download:', err);
      
      if (err.response && err.response.status === 403 && err.response.data.isProfessional === false) {
        setError('Accesso negato. Solo i professionisti registrati possono scaricare documenti.');
      } else {
        setError('Errore durante il download. Riprova più tardi.');
      }
    }
  };

  // Elimina un documento
  const handleDelete = async (documentId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo documento?')) {
      return;
    }

    // Se stiamo usando dati fittizi, simula l'eliminazione
    if (useMockData) {
      setDocuments(documents.filter(doc => doc._id !== documentId));
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/api/documents/${projectId}/document/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Aggiorna la lista dei documenti
      setDocuments(documents.filter(doc => doc._id !== documentId));
    } catch (err) {
      console.error('Errore durante l\'eliminazione:', err);
      
      if (err.response && err.response.status === 403 && err.response.data.isProfessional === false) {
        setError('Accesso negato. Solo i professionisti registrati possono eliminare documenti.');
      } else {
        setError('Errore durante l\'eliminazione. Riprova più tardi.');
      }
    }
  };

  // Restituisce l'icona appropriata in base al tipo di file
  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) {
      return <FaFilePdf className="file-icon pdf" />;
    } else if (mimeType.includes('image')) {
      return <FaFileImage className="file-icon image" />;
    } else if (mimeType.includes('word')) {
      return <FaFileWord className="file-icon word" />;
    } else if (mimeType.includes('sheet') || mimeType.includes('excel')) {
      return <FaFileExcel className="file-icon excel" />;
    } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
      return <FaFilePowerpoint className="file-icon powerpoint" />;
    } else if (mimeType.includes('acad') || mimeType.includes('dwg') || mimeType.includes('dxf')) {
      return <FaFileAlt className="file-icon cad" />;
    } else {
      return <FaFileAlt className="file-icon" />;
    }
  };

  // Formatta la dimensione del file
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  };

  // Formatta la data
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  // Se stiamo verificando lo stato professionale, mostra un loader
  if (checkingProfessional) {
    return (
      <div className="document-manager">
        <h3>Gestione Documenti</h3>
        <div className="loading">Verifica autorizzazioni...</div>
      </div>
    );
  }

  // Se l'utente non è un professionista, mostra un messaggio
  if (isProfessional === false && !useMockData) {
    return (
      <div className="document-manager">
        <h3>Gestione Documenti</h3>
        <div className="professional-required">
          <FaLock className="lock-icon" />
          <h4>Accesso riservato ai professionisti</h4>
          <p>Questa sezione è accessibile solo ai professionisti registrati.</p>
          <p>Per accedere a questa funzionalità, registrati come professionista o contatta l'amministratore.</p>
          <button 
            className="become-professional-btn"
            onClick={() => window.location.href = '/professionals/register'}
          >
            <FaUserTie /> Diventa un professionista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="document-manager">
      <h3>Gestione Documenti</h3>
      
      {useMockData && (
        <div className="demo-notice">
          <p>Modalità demo: i dati visualizzati sono fittizi. Le operazioni di upload, download ed eliminazione sono simulate.</p>
        </div>
      )}
      
      {/* Form di upload */}
      <div className="upload-section">
        <h4>Carica un nuovo documento</h4>
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-group">
            <label htmlFor="file-upload">File:</label>
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="file-input"
            />
            {selectedFile && (
              <div className="selected-file">
                <FaFileAlt /> {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descrizione:</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrizione del documento"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Categoria:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Planimetria">Planimetria</option>
              <option value="Contratto">Contratto</option>
              <option value="Preventivo">Preventivo</option>
              <option value="Fattura">Fattura</option>
              <option value="Altro">Altro</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="upload-btn"
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <span className="spinner"></span> Caricamento... {uploadProgress}%
              </>
            ) : (
              <>
                <FaUpload /> Carica Documento
              </>
            )}
          </button>
        </form>
        
        {/* Barra di progresso */}
        {uploading && (
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
      
      {/* Messaggi di errore */}
      {error && <div className={`error-message ${useMockData ? 'demo-error' : ''}`}>{error}</div>}
      
      {/* Lista documenti */}
      <div className="documents-list">
        <h4>Documenti del progetto</h4>
        
        {loading ? (
          <div className="loading">Caricamento documenti...</div>
        ) : documents.length === 0 ? (
          <div className="no-documents">
            <p>Nessun documento disponibile</p>
            <button 
              className="add-document-btn"
              onClick={() => {
                // Scorri fino alla sezione di upload
                const uploadSection = document.querySelector('.upload-section');
                if (uploadSection) {
                  uploadSection.scrollIntoView({ behavior: 'smooth' });
                  // Evidenzia il form
                  uploadSection.classList.add('highlight');
                  // Rimuovi l'evidenziazione dopo 2 secondi
                  setTimeout(() => {
                    uploadSection.classList.remove('highlight');
                  }, 2000);
                }
              }}
            >
              <FaPlus /> Aggiungi il primo documento
            </button>
          </div>
        ) : (
          <div className="documents-grid">
            {documents.map((doc) => (
              <div key={doc._id} className="document-card">
                <div className="document-icon">
                  {getFileIcon(doc.mimeType)}
                </div>
                <div className="document-info">
                  <h5 className="document-name" title={doc.originalName}>
                    {doc.originalName.length > 20 
                      ? doc.originalName.substring(0, 20) + '...' 
                      : doc.originalName}
                  </h5>
                  <p className="document-description">{doc.description || 'Nessuna descrizione'}</p>
                  <p className="document-meta">
                    <span className="document-category">{doc.category}</span>
                    <span className="document-size">{formatFileSize(doc.size)}</span>
                  </p>
                  <p className="document-date">
                    Caricato il {formatDate(doc.createdAt)}
                  </p>
                  <p className="document-uploader">
                    da {doc.uploadedBy.name}
                  </p>
                </div>
                <div className="document-actions">
                  <button 
                    onClick={() => handleDownload(doc._id)}
                    className="download-btn"
                    title="Scarica"
                  >
                    <FaDownload />
                  </button>
                  <button 
                    onClick={() => handleDelete(doc._id)}
                    className="delete-btn"
                    title="Elimina"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentManager; 