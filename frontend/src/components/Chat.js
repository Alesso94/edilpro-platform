import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUser, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

const Chat = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    // Esempio di dati di test
    useEffect(() => {
        // Qui andrà la chiamata API per ottenere le conversazioni
        const mockConversations = [
            { id: 1, name: 'Mario Rossi', role: 'Architetto', unread: 2 },
            { id: 2, name: 'Laura Bianchi', role: 'Ingegnere Civile', unread: 0 },
            { id: 3, name: 'Giuseppe Verdi', role: 'Geometra', unread: 1 },
        ];
        setConversations(mockConversations);
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            // Qui andrà la chiamata API per ottenere i messaggi della conversazione
            const mockMessages = [
                { id: 1, sender: 'other', text: 'Ciao, ho visto il tuo progetto', time: '10:30' },
                { id: 2, sender: 'me', text: 'Grazie! Cosa ne pensi?', time: '10:31' },
                { id: 3, sender: 'other', text: 'Mi piace molto la soluzione che hai proposto', time: '10:32' },
            ];
            setMessages(mockMessages);
        }
    }, [selectedConversation]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsg = {
            id: messages.length + 1,
            sender: 'me',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="chat-container">
            <div className="chat-header-main">
                <div className="user-info">
                    <FaUser className="user-avatar" />
                    <div className="user-details">
                        <span className="user-name">{user?.name || 'Professionista'}</span>
                        <span className="user-role">{user?.role || 'Ruolo non specificato'}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-button">
                    <FaSignOutAlt /> Esci
                </button>
            </div>
            <div className="chat-content">
                <div className="chat-sidebar">
                    <div className="chat-search">
                        <div className="search-input-container">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Cerca professionisti..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="conversations-list">
                        {filteredConversations.map(conv => (
                            <div
                                key={conv.id}
                                className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                                onClick={() => setSelectedConversation(conv)}
                            >
                                <div className="conversation-avatar">
                                    <FaUser />
                                </div>
                                <div className="conversation-info">
                                    <div className="conversation-name">{conv.name}</div>
                                    <div className="conversation-role">{conv.role}</div>
                                </div>
                                {conv.unread > 0 && (
                                    <div className="unread-badge">{conv.unread}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chat-main">
                    {selectedConversation ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-header-info">
                                    <h2>{selectedConversation.name}</h2>
                                    <p>{selectedConversation.role}</p>
                                </div>
                            </div>
                            <div className="messages-container">
                                {messages.map(message => (
                                    <div
                                        key={message.id}
                                        className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-content">
                                            <p>{message.text}</p>
                                            <span className="message-time">{message.time}</span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form className="message-input" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder="Scrivi un messaggio..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="send-button">
                                    <FaPaperPlane />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <h2>Seleziona una conversazione</h2>
                            <p>Scegli un professionista dalla lista per iniziare a chattare</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat; 