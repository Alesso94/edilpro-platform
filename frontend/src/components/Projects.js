import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FaProjectDiagram, FaCalendarAlt, FaMoneyBillWave, FaSearch, FaTrash, FaEdit, FaFile, FaComment, FaDownload, FaDraftingCompass, FaSignOutAlt, FaUser, FaUsers, FaCube } from 'react-icons/fa';
import { MdBuild, MdTimeline, MdCategory, MdAttachFile, Md3DRotation } from 'react-icons/md';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './Projects.css';
import { useNavigate } from 'react-router-dom';
import DocumentManager from './DocumentManager';

export default function Projects({ user, onLogout }) {
    const PROJECT_STATUSES = [
        'In Corso',
        'Completato',
        'In Attesa',
        'Cancellato',
        'In Pianificazione'
    ];

    const PROJECT_CATEGORIES = [
        'Ristrutturazione',
        'Costruzione',
        'Impianti',
        'Design Interni',
        'Manutenzione',
        'Altro'
    ];

    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        status: 'In Corso',
        category: ''
    });

    const [projects, setProjects] = useState([
        {
            id: 1,
            title: 'Ristrutturazione Villa',
            description: 'Ristrutturazione completa di una villa storica',
            startDate: '2024-03-01',
            endDate: '2024-06-30',
            budget: 250000,
            status: 'In Corso',
            category: 'Ristrutturazione',
            progress: 35,
            tasks: [
                { id: 1, name: 'Demolizione pareti', completed: true },
                { id: 2, name: 'Rifacimento impianto elettrico', completed: false },
                { id: 3, name: 'Pavimentazione', completed: false }
            ]
        }
    ]);

    // Stati per filtri e ricerca
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortBy, setSortBy] = useState('date'); // 'date', 'budget', 'progress'
    const [editingProject, setEditingProject] = useState(null);

    // Stati per documenti e commenti
    const [projectDocuments, setProjectDocuments] = useState({});
    const [projectComments, setProjectComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    // Stati per file CAD
    const [projectCadFiles, setProjectCadFiles] = useState({});
    const CAD_FILE_TYPES = ['.dwg', '.dxf', '.rvt', '.rfa', '.ifc'];

    // All'interno del componente, aggiungi una variabile di stato per il progetto selezionato
    const [selectedProject, setSelectedProject] = useState(null);

    // Configurazione axios con il token
    const axiosAuth = axios.create({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const fetchProjects = useCallback(async () => {
        try {
            const response = await axiosAuth.get('/api/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Errore nel caricamento dei progetti:', error);
        }
    }, [axiosAuth]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosAuth.post('/api/projects', newProject);
            setProjects([...projects, response.data]);
            setNewProject({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                budget: '',
                status: '',
                category: ''
            });
            setEditingProject(null);
        } catch (error) {
            console.error('Errore nella creazione del progetto:', error);
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setNewProject({
            title: project.title,
            description: project.description,
            startDate: project.startDate,
            endDate: project.endDate,
            budget: project.budget,
            status: project.status,
            category: project.category
        });
    };

    const handleDelete = async (projectId) => {
        if (window.confirm('Sei sicuro di voler eliminare questo progetto?')) {
            try {
                await axiosAuth.delete(`/api/projects/${projectId}`);
                setProjects(projects.filter(project => project.id !== projectId));
            } catch (error) {
                console.error('Errore nell\'eliminazione del progetto:', error);
            }
        }
    };

    const addTask = async (projectId) => {
        const taskName = prompt('Inserisci il nome della nuova attività:');
        if (taskName) {
            try {
                const response = await axiosAuth.post(`/api/projects/${projectId}/tasks`, {
                    name: taskName
                });
                setProjects(projects.map(project => {
                    if (project.id === projectId) {
                        return {
                            ...project,
                            tasks: [...project.tasks, response.data]
                        };
                    }
                    return project;
                }));
            } catch (error) {
                console.error('Errore nell\'aggiunta dell\'attività:', error);
            }
        }
    };

    const toggleTask = async (projectId, taskId) => {
        try {
            const response = await axiosAuth.put(`/api/projects/${projectId}/tasks/${taskId}`);
            setProjects(projects.map(project => 
                project.id === projectId ? response.data : project
            ));
        } catch (error) {
            console.error('Errore nel toggle dell\'attività:', error);
        }
    };

    // Funzione per gestire l'upload dei documenti
    const onDrop = useCallback(async (acceptedFiles, projectId) => {
        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await axiosAuth.post(
                `/api/projects/${projectId}/documents`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setProjectDocuments(prev => ({
                ...prev,
                [projectId]: [...(prev[projectId] || []), ...response.data]
            }));
        } catch (error) {
            console.error('Errore nel caricamento dei documenti:', error);
        }
    }, [axiosAuth]);

    // Configurazione dropzone per documenti
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: files => selectedProjectId && onDrop(files, selectedProjectId),
        multiple: true
    });

    // Funzione per verificare se un file è di tipo CAD
    const isCADFile = useCallback((filename) => {
        return CAD_FILE_TYPES.some(ext => filename.toLowerCase().endsWith(ext));
    }, [CAD_FILE_TYPES]);

    // Funzione per gestire l'upload dei file CAD
    const onCadDrop = useCallback(async (acceptedFiles, projectId) => {
        const cadFiles = acceptedFiles.filter(file => isCADFile(file.name));
        if (cadFiles.length === 0) {
            alert('Per favore carica solo file CAD (.dwg, .dxf, .rvt, .rfa, .ifc)');
            return;
        }

        const formData = new FormData();
        cadFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await axiosAuth.post(
                `/api/projects/${projectId}/cad`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setProjectCadFiles(prev => ({
                ...prev,
                [projectId]: [...(prev[projectId] || []), ...response.data]
            }));
        } catch (error) {
            console.error('Errore nel caricamento dei file CAD:', error);
        }
    }, [axiosAuth, isCADFile]);

    // Configurazione dropzone per i file CAD
    const { getRootProps: getCadRootProps, getInputProps: getCadInputProps } = useDropzone({
        onDrop: files => selectedProjectId && onCadDrop(files, selectedProjectId),
        multiple: true,
        accept: {
            'application/acad': ['.dwg'],
            'application/dxf': ['.dxf'],
            'application/revit': ['.rvt', '.rfa'],
            'application/ifc': ['.ifc']
        }
    });

    // Funzione per aggiungere un commento
    const handleAddComment = async (projectId) => {
        if (!newComment.trim()) return;
        
        try {
            const response = await axiosAuth.post(`/api/projects/${projectId}/comments`, {
                text: newComment,
                author: 'Utente'
            });
            
            setProjectComments(prev => ({
                ...prev,
                [projectId]: [...(prev[projectId] || []), response.data]
            }));
            setNewComment('');
        } catch (error) {
            console.error('Errore nell\'aggiunta del commento:', error);
        }
    };

    // Funzione per scaricare un documento
    const handleDownload = async (document) => {
        try {
            const response = await axiosAuth.get(document.path, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', document.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Errore nel download del file:', error);
        }
    };

    // Filtra e ordina i progetti
    const filteredAndSortedProjects = projects
        .filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               project.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = !statusFilter || project.status === statusFilter;
            const matchesCategory = !categoryFilter || project.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(a.startDate) - new Date(b.startDate);
                case 'budget':
                    return b.budget - a.budget;
                case 'progress':
                    return b.progress - a.progress;
                default:
                    return 0;
            }
        });

    const navigate = useNavigate();

    // Nella funzione che gestisce il click su un progetto
    const handleProjectClick = (project) => {
        // Verifica se il progetto è un oggetto fittizio (ha un id numerico) o un progetto reale (ha un _id MongoDB)
        const isRealProject = project._id && typeof project._id === 'string' && project._id.length === 24;
        
        // Se è un progetto fittizio, aggiungiamo un flag per indicare che è un progetto demo
        const projectWithId = {
            ...project,
            _id: project._id || project.id, // Usiamo _id se esiste, altrimenti id
            isDemo: !isRealProject
        };
        
        setSelectedProject(projectWithId);
        console.log("Progetto selezionato:", projectWithId);
    };

    return (
        <div className="projects-page">
            <nav className="projects-navbar">
                <div className="navbar-left">
                    <FaProjectDiagram className="nav-icon" />
                    <span className="nav-title">I Tuoi Progetti</span>
                </div>
                <div className="navbar-right">
                    <div className="user-info">
                        <FaUser className="nav-icon" />
                        <span>{user.name}</span>
                        <span className="user-role">({user.profession})</span>
                    </div>
                    <button onClick={() => navigate('/chat')} className="chat-btn">
                        <FaUsers />
                        <span>Chat</span>
                    </button>
                    <button onClick={onLogout} className="logout-btn">
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            <div className="projects-content">
                <section className="new-project-section">
                    <h2><FaProjectDiagram /> {editingProject ? 'Modifica Progetto' : 'Nuovo Progetto'}</h2>
                    <form onSubmit={handleSubmit} className="project-form">
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Titolo del progetto"
                                value={newProject.title}
                                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Descrizione"
                                value={newProject.description}
                                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Data Inizio:</label>
                                <input
                                    type="date"
                                    value={newProject.startDate}
                                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Data Fine:</label>
                                <input
                                    type="date"
                                    value={newProject.endDate}
                                    onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="number"
                                    placeholder="Budget (€)"
                                    value={newProject.budget}
                                    onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <select
                                    value={newProject.status}
                                    onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                                    required
                                >
                                    <option value="">Seleziona stato</option>
                                    {PROJECT_STATUSES.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <select
                                    value={newProject.category}
                                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                                    required
                                >
                                    <option value="">Seleziona categoria</option>
                                    {PROJECT_CATEGORIES.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">
                            {editingProject ? 'Aggiorna Progetto' : 'Crea Progetto'}
                        </button>
                        {editingProject && (
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => {
                                    setEditingProject(null);
                                    setNewProject({
                                        title: '',
                                        description: '',
                                        startDate: '',
                                        endDate: '',
                                        budget: '',
                                        status: 'In Corso',
                                        category: ''
                                    });
                                }}
                            >
                                Annulla Modifiche
                            </button>
                        )}
                    </form>
                </section>

                <section className="projects-list">
                    <div className="projects-header">
                        <h2><MdBuild /> Progetti</h2>
                        <div className="filters-container">
                            <div className="search-box">
                                <FaSearch />
                                <input
                                    type="text"
                                    placeholder="Cerca progetti..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Tutti gli stati</option>
                                {PROJECT_STATUSES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Tutte le categorie</option>
                                {PROJECT_CATEGORIES.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="filter-select"
                            >
                                <option value="date">Ordina per Data</option>
                                <option value="budget">Ordina per Budget</option>
                                <option value="progress">Ordina per Avanzamento</option>
                            </select>
                        </div>
                    </div>

                    {filteredAndSortedProjects.map(project => (
                        <div key={project.id} className="project-card" onClick={() => handleProjectClick(project)}>
                            <div className="project-header">
                                <h3>{project.title}</h3>
                                <div className="project-actions">
                                    <button 
                                        className="icon-btn edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(project);
                                        }}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="icon-btn delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(project.id);
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <div className="project-subheader">
                                <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                                    {project.status}
                                </span>
                                <span className="category-badge">
                                    <MdCategory /> {project.category}
                                </span>
                            </div>
                            <p>{project.description}</p>
                            
                            <div className="project-details">
                                <div className="detail-item">
                                    <FaCalendarAlt />
                                    <span>Dal {project.startDate} al {project.endDate}</span>
                                </div>
                                <div className="detail-item">
                                    <FaMoneyBillWave />
                                    <span>{parseInt(project.budget).toLocaleString()}€</span>
                                </div>
                            </div>

                            <div className="progress-section">
                                <div className="progress-header">
                                    <h4>Avanzamento</h4>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="tasks-section">
                                <div className="tasks-header">
                                    <h4><MdTimeline /> Attività</h4>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addTask(project.id);
                                        }}
                                        className="add-task-btn"
                                    >
                                        + Aggiungi
                                    </button>
                                </div>
                                <div className="tasks-list">
                                    {project.tasks.map(task => (
                                        <div 
                                            key={task.id} 
                                            className={`task-item ${task.completed ? 'completed' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleTask(project.id, task.id);
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                readOnly
                                            />
                                            <span>{task.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sezione File CAD */}
                            <div className="cad-files-section">
                                <div className="section-header">
                                    <h4><FaDraftingCompass /> File CAD</h4>
                                    <button 
                                        className="upload-btn cad"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedProjectId(project.id);
                                        }}
                                    >
                                        <FaCube /> Carica CAD
                                    </button>
                                </div>
                                
                                {selectedProjectId === project.id && (
                                    <div {...getCadRootProps()} className="dropzone cad">
                                        <input {...getCadInputProps()} />
                                        <p>Trascina qui i file CAD o clicca per selezionarli</p>
                                        <small>Formati supportati: {CAD_FILE_TYPES.join(', ')}</small>
                                    </div>
                                )}

                                <div className="cad-files-list">
                                    {(projectCadFiles[project.id] || []).map(cad => (
                                        <div key={cad.id} className="cad-file-item">
                                            <div className="cad-file-info">
                                                <span className="cad-file-icon">
                                                    <FaDraftingCompass />
                                                </span>
                                                <div className="cad-file-details">
                                                    <span className="cad-file-name">{cad.name}</span>
                                                    <span className="cad-file-meta">
                                                        {(cad.size / 1024 / 1024).toFixed(2)} MB • 
                                                        {new Date(cad.uploadDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="cad-file-actions">
                                                <button 
                                                    className="icon-btn download"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(cad);
                                                    }}
                                                    title="Scarica"
                                                >
                                                    <FaDownload />
                                                </button>
                                                <button 
                                                    className="icon-btn delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setProjectCadFiles(prev => ({
                                                            ...prev,
                                                            [project.id]: prev[project.id].filter(f => f.id !== cad.id)
                                                        }));
                                                    }}
                                                    title="Elimina"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sezione Documenti */}
                            <div className="documents-section">
                                <div className="section-header">
                                    <h4><FaFile /> Documenti</h4>
                                    <button 
                                        className="upload-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedProjectId(project.id);
                                        }}
                                    >
                                        <MdAttachFile /> Carica
                                    </button>
                                </div>
                                
                                {selectedProjectId === project.id && (
                                    <div {...getRootProps()} className="dropzone">
                                        <input {...getInputProps()} />
                                        <p>Trascina qui i file o clicca per selezionarli</p>
                                    </div>
                                )}

                                <div className="documents-list">
                                    {(projectDocuments[project.id] || []).map(doc => (
                                        <div key={doc.id} className="document-item">
                                            <span className="document-name">{doc.name}</span>
                                            <div className="document-actions">
                                                <button 
                                                    className="icon-btn download"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(doc);
                                                    }}
                                                >
                                                    <FaDownload />
                                                </button>
                                                <button 
                                                    className="icon-btn delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setProjectDocuments(prev => ({
                                                            ...prev,
                                                            [project.id]: prev[project.id].filter(d => d.id !== doc.id)
                                                        }));
                                                    }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sezione Commenti */}
                            <div className="comments-section">
                                <div className="section-header">
                                    <h4><FaComment /> Commenti</h4>
                                </div>
                                
                                <div className="comments-list">
                                    {(projectComments[project.id] || []).map(comment => (
                                        <div key={comment.id} className="comment-item">
                                            <div className="comment-header">
                                                <span className="comment-author">{comment.author}</span>
                                                <span className="comment-date">
                                                    {new Date(comment.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="comment-text">{comment.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="add-comment">
                                    <textarea
                                        placeholder="Aggiungi un commento..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button 
                                        className="submit-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddComment(project.id);
                                        }}
                                    >
                                        Invia
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {selectedProject && (
                    <div className="project-details-container">
                        <div className="project-details">
                            <h2>{selectedProject.title}</h2>
                            <p className="project-description">{selectedProject.description}</p>
                            
                            {selectedProject.isDemo ? (
                                <div className="demo-message">
                                    <p>Questo è un progetto dimostrativo. La gestione documenti è disponibile solo per progetti reali.</p>
                                    <p>Crea un nuovo progetto per utilizzare tutte le funzionalità.</p>
                                    <button 
                                        className="create-project-btn"
                                        onClick={() => {
                                            // Scorri fino alla sezione di creazione progetto
                                            const newProjectSection = document.querySelector('.new-project-section');
                                            if (newProjectSection) {
                                                newProjectSection.scrollIntoView({ behavior: 'smooth' });
                                                // Evidenzia il form
                                                newProjectSection.classList.add('highlight');
                                                // Rimuovi l'evidenziazione dopo 2 secondi
                                                setTimeout(() => {
                                                    newProjectSection.classList.remove('highlight');
                                                }, 2000);
                                            }
                                        }}
                                    >
                                        Crea Nuovo Progetto
                                    </button>
                                </div>
                            ) : (
                                <DocumentManager projectId={selectedProject._id} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}