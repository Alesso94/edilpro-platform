import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaPlus, FaFileAlt } from 'react-icons/fa';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }

    // Fetch project details
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`http://localhost:3001/api/projects/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }

        const data = await response.json();
        setProject(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/projects');
  };

  const handleEdit = () => {
    // Navigate to edit project page or open edit modal
    console.log('Edit project:', id);
  };

  const handleDelete = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questo progetto? Questa azione non può essere annullata.')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`http://localhost:3001/api/projects/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete project');
        }

        navigate('/projects', { state: { message: 'Progetto eliminato con successo' } });
      } catch (err) {
        console.error('Error deleting project:', err);
        setError(err.message);
      }
    }
  };

  const handleViewDocuments = () => {
    // Navigate to documents page for this project
    navigate(`/documents?projectId=${id}`);
  };

  if (loading) {
    return <div className="loading">Caricamento dettagli progetto...</div>;
  }

  if (error) {
    return <div className="error">Errore: {error}</div>;
  }

  if (!project) {
    return <div className="not-found">Progetto non trovato</div>;
  }

  const isOwner = user && project.owner === user._id;

  return (
    <div className="project-details-container">
      <div className="project-details-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft /> Torna ai Progetti
        </button>
        <h1>{project.name}</h1>
        {isOwner && (
          <div className="project-actions">
            <button className="edit-button" onClick={handleEdit}>
              <FaEdit /> Modifica
            </button>
            <button className="delete-button" onClick={handleDelete}>
              <FaTrash /> Elimina
            </button>
          </div>
        )}
      </div>

      <div className="project-details-content">
        <div className="project-info">
          <h2>Informazioni Progetto</h2>
          <p><strong>Descrizione:</strong> {project.description}</p>
          <p><strong>Indirizzo:</strong> {project.address}</p>
          <p><strong>Stato:</strong> {project.status}</p>
          <p><strong>Data di inizio:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
          {project.endDate && (
            <p><strong>Data di fine:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
          )}
          <p><strong>Budget:</strong> €{project.budget.toLocaleString()}</p>
        </div>

        <div className="project-documents">
          <h2>Documenti</h2>
          <button className="view-documents-button" onClick={handleViewDocuments}>
            <FaFileAlt /> Visualizza Documenti
          </button>
        </div>

        <div className="project-team">
          <h2>Team di Progetto</h2>
          {project.team && project.team.length > 0 ? (
            <ul className="team-list">
              {project.team.map(member => (
                <li key={member._id} className="team-member">
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nessun membro del team assegnato a questo progetto.</p>
          )}
          {isOwner && (
            <button className="add-member-button">
              <FaPlus /> Aggiungi Membro
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 