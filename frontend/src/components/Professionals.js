import React from 'react';
import { FaUserTie, FaMapMarkerAlt, FaBriefcase, FaStar } from 'react-icons/fa';
import './Professionals.css';

const Professionals = () => {
    // Dati di esempio dei professionisti
    const professionals = [
        {
            id: 1,
            name: "Marco Rossi",
            profession: "Architetto",
            location: "Milano",
            rating: 4.8,
            specializations: ["Ristrutturazioni", "Design Interni"],
            projects: 45
        },
        {
            id: 2,
            name: "Laura Bianchi",
            profession: "Ingegnere Civile",
            location: "Roma",
            rating: 4.9,
            specializations: ["Strutture", "Progetti Pubblici"],
            projects: 38
        },
        {
            id: 3,
            name: "Giuseppe Verdi",
            profession: "Geometra",
            location: "Torino",
            rating: 4.7,
            specializations: ["Catasto", "Perizie"],
            projects: 62
        },
        {
            id: 4,
            name: "Anna Neri",
            profession: "Architetto",
            location: "Firenze",
            rating: 4.9,
            specializations: ["Restauro", "Bioedilizia"],
            projects: 41
        },
        {
            id: 5,
            name: "Paolo Mari",
            profession: "Ingegnere Edile",
            location: "Bologna",
            rating: 4.8,
            specializations: ["Efficienza Energetica", "Domotica"],
            projects: 35
        },
        {
            id: 6,
            name: "Elena Costa",
            profession: "Interior Designer",
            location: "Venezia",
            rating: 4.7,
            specializations: ["Design Moderno", "Spazi Commerciali"],
            projects: 53
        }
    ];

    return (
        <div className="professionals-page">
            <header className="professionals-header">
                <h1>I Nostri Professionisti</h1>
                <p>Scopri la rete di professionisti qualificati pronti a realizzare i tuoi progetti</p>
            </header>

            <div className="professionals-grid">
                {professionals.map(prof => (
                    <div key={prof.id} className="professional-card">
                        <div className="professional-header">
                            <div className="professional-avatar">
                                <FaUserTie />
                            </div>
                            <div className="professional-info">
                                <h3>{prof.name}</h3>
                                <span className="profession">{prof.profession}</span>
                            </div>
                        </div>
                        
                        <div className="professional-details">
                            <div className="location">
                                <FaMapMarkerAlt />
                                <span>{prof.location}</span>
                            </div>
                            
                            <div className="rating">
                                <FaStar />
                                <span>{prof.rating}</span>
                            </div>

                            <div className="projects">
                                <FaBriefcase />
                                <span>{prof.projects} progetti</span>
                            </div>
                        </div>

                        <div className="specializations">
                            {prof.specializations.map((spec, index) => (
                                <span key={index} className="specialization-tag">
                                    {spec}
                                </span>
                            ))}
                        </div>

                        <button className="contact-btn">
                            Contatta
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Professionals; 