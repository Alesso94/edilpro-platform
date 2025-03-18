import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './Settings.css';

function Settings() {
    const { t, language, changeLanguage } = useLanguage();
    const [settings, setSettings] = useState({
        // Notifiche
        notificationsEnabled: true,
        emailNotifications: true,
        smsNotifications: false,
        projectUpdatesNotifications: true,
        deadlineNotifications: true,
        documentNotifications: true,
        
        // Preferenze di visualizzazione
        language: 'it',
        theme: 'light',
        dateFormat: 'dd/MM/yyyy',
        currencyFormat: '€',
        measurementUnit: 'metric', // metric/imperial
        
        // Privacy e sicurezza
        profileVisibility: 'public',
        showContactInfo: true,
        showPortfolio: true,
        twoFactorEnabled: false,
        
        // Integrazioni
        calendarSync: false,
        googleDriveSync: false,
        dropboxSync: false,
        
        // Preferenze documenti
        defaultPdfScale: '1:100',
        autoSaveInterval: 5, // minuti
        fileNamingConvention: 'project-date-version'
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token non trovato');
                setMessage('Sessione scaduta. Effettua nuovamente il login.');
                navigate('/login');
                return;
            }

            console.log('Richiesta impostazioni con token:', token);
            const response = await axios.get('http://localhost:3001/api/settings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Risposta dal server:', response.data);
            setSettings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Errore dettagliato:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                setMessage('Sessione scaduta. Effettua nuovamente il login.');
                navigate('/login');
            } else {
                setMessage(`Errore nel caricamento delle impostazioni: ${error.response?.data?.message || error.message}`);
            }
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'language') {
            changeLanguage(value);
        }
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Sessione scaduta. Effettua nuovamente il login.');
                navigate('/login');
                return;
            }

            console.log('Invio aggiornamento impostazioni:', settings);
            const response = await axios.put('http://localhost:3001/api/settings', settings, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Risposta aggiornamento:', response.data);
            setMessage('Impostazioni salvate con successo!');
            
            // Applica il tema
            document.documentElement.setAttribute('data-theme', settings.theme);
            
            // Salva la lingua nelle preferenze locali
            localStorage.setItem('language', settings.language);
            
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Errore dettagliato durante il salvataggio:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                setMessage('Sessione scaduta. Effettua nuovamente il login.');
                navigate('/login');
            } else {
                setMessage(`Errore durante il salvataggio: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    if (loading) {
        return <div className="settings-container">{t.settings.messages.loading}</div>;
    }

    return (
        <div className="settings-container">
            <h2>{t.settings.title}</h2>
            {message && <div className={`message ${message.includes('Errore') || message.includes('scaduta') ? 'error' : 'success'}`}>{message}</div>}
            
            <form onSubmit={handleSubmit}>
                {/* Sezione Notifiche */}
                <div className="settings-section">
                    <h3>{t.settings.notifications.title}</h3>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                name="notificationsEnabled"
                                checked={settings.notificationsEnabled}
                                onChange={handleChange}
                            />
                            {t.settings.notifications.enableAll}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                name="emailNotifications"
                                checked={settings.emailNotifications}
                                onChange={handleChange}
                            />
                            {t.settings.notifications.email}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                name="smsNotifications"
                                checked={settings.smsNotifications}
                                onChange={handleChange}
                            />
                            {t.settings.notifications.sms}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                name="projectUpdatesNotifications"
                                checked={settings.projectUpdatesNotifications}
                                onChange={handleChange}
                            />
                            {t.settings.notifications.projectUpdates}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                name="deadlineNotifications"
                                checked={settings.deadlineNotifications}
                                onChange={handleChange}
                            />
                            {t.settings.notifications.deadlines}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                name="documentNotifications"
                                checked={settings.documentNotifications}
                                onChange={handleChange}
                            />
                            {t.settings.notifications.documents}
                        </label>
                    </div>
                </div>

                {/* Sezione Preferenze di Visualizzazione */}
                <div className="settings-section">
                    <h3>{t.settings.display.title}</h3>
                    <div className="setting-item">
                        <label>{t.settings.display.language}:</label>
                        <select name="language" value={language} onChange={handleChange}>
                            <option value="it">Italiano</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>{t.settings.display.theme}:</label>
                        <select name="theme" value={settings.theme} onChange={handleChange}>
                            <option value="light">{t.settings.display.themes.light}</option>
                            <option value="dark">{t.settings.display.themes.dark}</option>
                            <option value="high-contrast">{t.settings.display.themes.highContrast}</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>{t.settings.display.dateFormat}:</label>
                        <select name="dateFormat" value={settings.dateFormat} onChange={handleChange}>
                            <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                            <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                            <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>{t.settings.display.measurementUnit}:</label>
                        <select name="measurementUnit" value={settings.measurementUnit} onChange={handleChange}>
                            <option value="metric">{t.settings.display.units.metric}</option>
                            <option value="imperial">{t.settings.display.units.imperial}</option>
                        </select>
                    </div>
                </div>

                {/* Sezione Privacy e Sicurezza */}
                <div className="settings-section">
                    <h3>{t.settings.privacy.title}</h3>
                    <div className="setting-item">
                        <label>{t.settings.privacy.visibility}:</label>
                        <select name="profileVisibility" value={settings.profileVisibility} onChange={handleChange}>
                            <option value="public">{t.settings.privacy.visibilityOptions.public}</option>
                            <option value="private">{t.settings.privacy.visibilityOptions.private}</option>
                            <option value="contacts">{t.settings.privacy.visibilityOptions.contacts}</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                name="showContactInfo"
                                checked={settings.showContactInfo}
                                onChange={handleChange}
                            />
                            {t.settings.privacy.showContactInfo}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                name="twoFactorEnabled"
                                checked={settings.twoFactorEnabled}
                                onChange={handleChange}
                            />
                            {t.settings.privacy.twoFactor}
                        </label>
                    </div>
                </div>

                {/* Sezione Integrazioni */}
                <div className="settings-section">
                    <h3>{t.settings.integrations.title}</h3>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                name="calendarSync"
                                checked={settings.calendarSync}
                                onChange={handleChange}
                            />
                            {t.settings.integrations.calendar}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                name="googleDriveSync"
                                checked={settings.googleDriveSync}
                                onChange={handleChange}
                            />
                            {t.settings.integrations.drive}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                name="dropboxSync"
                                checked={settings.dropboxSync}
                                onChange={handleChange}
                            />
                            {t.settings.integrations.dropbox}
                        </label>
                    </div>
                </div>

                {/* Sezione Preferenze Documenti */}
                <div className="settings-section">
                    <h3>{t.settings.documents.title}</h3>
                    <div className="setting-item">
                        <label>{t.settings.documents.scale}:</label>
                        <select name="defaultPdfScale" value={settings.defaultPdfScale} onChange={handleChange}>
                            <option value="1:20">1:20</option>
                            <option value="1:50">1:50</option>
                            <option value="1:100">1:100</option>
                            <option value="1:200">1:200</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>{t.settings.documents.autoSave}:</label>
                        <select name="autoSaveInterval" value={settings.autoSaveInterval} onChange={handleChange}>
                            <option value="1">1</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>{t.settings.documents.naming}:</label>
                        <select name="fileNamingConvention" value={settings.fileNamingConvention} onChange={handleChange}>
                            <option value="project-date-version">{t.settings.documents.namingOptions.projectDateVersion}</option>
                            <option value="date-project-version">{t.settings.documents.namingOptions.dateProjVersion}</option>
                            <option value="custom">{t.settings.documents.namingOptions.custom}</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="save-button">{t.settings.buttons.save}</button>
            </form>
        </div>
    );
}

export default Settings; 