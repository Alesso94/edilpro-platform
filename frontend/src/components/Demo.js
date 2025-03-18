import React, { useState, useEffect } from 'react';
import { demoProjects } from '../demo-data/projects';
import { demoDocuments } from '../demo-data/documents';
import { demoUser } from '../demo-data/user';
import './Demo.css';

const Demo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sequenza demo automatica
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (currentStep < demoSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3000); // 3 secondi per step

      return () => clearTimeout(timer);
    }
  }, [currentStep, isPlaying]);

  const demoSteps = [
    {
      title: 'Dashboard Overview',
      content: (
        <div className="demo-dashboard">
          <h2>Benvenuto, {demoUser.name}</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Progetti Attivi</h3>
              <p className="stat-number">{demoUser.stats.activeProjects}</p>
            </div>
            <div className="stat-card">
              <h3>Progetti Completati</h3>
              <p className="stat-number">{demoUser.stats.completedProjects}</p>
            </div>
            <div className="stat-card">
              <h3>Documenti</h3>
              <p className="stat-number">{demoUser.stats.documentsUploaded}</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Gestione Progetti',
      content: (
        <div className="demo-projects">
          <h2>I Miei Progetti</h2>
          <div className="projects-grid">
            {demoProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <span className={`status ${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                </div>
                <p>{project.description}</p>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="progress-text">{project.progress}% Completato</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Gestione Documenti',
      content: (
        <div className="demo-documents">
          <h2>Documenti Recenti</h2>
          <div className="documents-list">
            {demoDocuments.map(doc => (
              <div key={doc.id} className="document-item">
                <div className="doc-icon">{doc.type}</div>
                <div className="doc-info">
                  <h4>{doc.name}</h4>
                  <p>Modificato: {new Date(doc.lastModified).toLocaleDateString()}</p>
                </div>
                <div className="doc-meta">
                  <span className="doc-size">{doc.size}</span>
                  <span className={`doc-status ${doc.status.toLowerCase()}`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="demo-container">
      <div className="demo-controls">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="control-button"
        >
          {isPlaying ? 'Pausa' : 'Play'}
        </button>
        <div className="step-indicators">
          {demoSteps.map((_, index) => (
            <div 
              key={index}
              className={`step-dot ${index === currentStep ? 'active' : ''}`}
              onClick={() => {
                setCurrentStep(index);
                setIsPlaying(false);
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="demo-content">
        <h1>{demoSteps[currentStep].title}</h1>
        {demoSteps[currentStep].content}
      </div>
    </div>
  );
};

export default Demo; 