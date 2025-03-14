import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosAuth from '../utils/axiosAuth';
import './AdminPanel.css';

const AdminPanel = () => {
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        profession: '',
        location: '',
        specializations: '',
        email: '',
        phone: '',
        rating: 5
    });
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfessionals();
    }, []);

    const fetchProfessionals = async () => {
        try {
            const response = await axiosAuth.get('/api/professionals?limit=100');
            setProfessionals(response.data.professionals);
            setLoading(false);
        } catch (error) {
            setError('Errore nel caricamento dei professionisti');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'specializations' ? value.split(',').map(s => s.trim()) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosAuth.put(`/api/professionals/${editingId}`, formData);
            } else {
                await axiosAuth.post('/api/professionals', formData);
            }
            setFormData({
                name: '',
                profession: '',
                location: '',
                specializations: '',
                email: '',
                phone: '',
                rating: 5
            });
            setEditingId(null);
            fetchProfessionals();
        } catch (error) {
            setError('Errore nel salvataggio del professionista');
        }
    };

    const handleEdit = (professional) => {
        setFormData({
            ...professional,
            specializations: professional.specializations.join(', ')
        });
        setEditingId(professional._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Sei sicuro di voler disattivare questo professionista?')) {
            try {
                await axiosAuth.delete(`/api/professionals/${id}`);
                fetchProfessionals();
            } catch (error) {
                setError('Errore nella disattivazione del professionista');
            }
        }
    };

    if (loading) return <div className="admin-panel loading">Caricamento...</div>;
    if (error) return <div className="admin-panel error">{error}</div>;

    return (
        <div className="admin-panel">
            <h1>Gestione Professionisti</h1>
            
            <form onSubmit={handleSubmit} className="professional-form">
                <h2>{editingId ? 'Modifica Professionista' : 'Aggiungi Professionista'}</h2>
                
                <div className="form-group">
                    <label>Nome:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Professione:</label>
                    <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Località:</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Specializzazioni (separate da virgola):</label>
                    <input
                        type="text"
                        name="specializations"
                        value={formData.specializations}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Telefono:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Valutazione:</label>
                    <input
                        type="number"
                        name="rating"
                        min="1"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">
                    {editingId ? 'Aggiorna' : 'Aggiungi'}
                </button>
                
                {editingId && (
                    <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => {
                            setEditingId(null);
                            setFormData({
                                name: '',
                                profession: '',
                                location: '',
                                specializations: '',
                                email: '',
                                phone: '',
                                rating: 5
                            });
                        }}
                    >
                        Annulla
                    </button>
                )}
            </form>

            <div className="professionals-list">
                <h2>Professionisti Registrati</h2>
                <div className="professionals-grid">
                    {professionals.map(professional => (
                        <div key={professional._id} className="professional-card">
                            <h3>{professional.name}</h3>
                            <p><strong>Professione:</strong> {professional.profession}</p>
                            <p><strong>Località:</strong> {professional.location}</p>
                            <p><strong>Specializzazioni:</strong> {professional.specializations.join(', ')}</p>
                            <p><strong>Valutazione:</strong> {professional.rating}/5</p>
                            <p><strong>Email:</strong> {professional.email}</p>
                            <p><strong>Telefono:</strong> {professional.phone}</p>
                            <div className="card-actions">
                                <button 
                                    onClick={() => handleEdit(professional)}
                                    className="edit-btn"
                                >
                                    Modifica
                                </button>
                                <button 
                                    onClick={() => handleDelete(professional._id)}
                                    className="delete-btn"
                                >
                                    Disattiva
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel; 