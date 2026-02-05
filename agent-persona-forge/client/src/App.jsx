/**
 * Agent Persona Forge - Main Application
 * 
 * A complete application for creating customizable AI agent personalities.
 * Features: Template selection, persona creation, preview/testing, and export.
 */

import { useState, useEffect } from 'react';
import PersonaCreator from './components/PersonaCreator';
import PersonaList from './components/PersonaList';
import TemplateGallery from './components/TemplateGallery';
import PreviewTester from './components/PreviewTester';
import './index.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingPersona, setEditingPersona] = useState(null);
  const [testingPersona, setTestingPersona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch templates
      const templatesRes = await fetch(`${API_URL}/templates`);
      const templatesData = await templatesRes.json();
      setTemplates(templatesData.templates);
      
      // Fetch personas
      const personasRes = await fetch(`${API_URL}/personas`);
      const personasData = await personasRes.json();
      setPersonas(personasData.personas);
      
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please ensure the server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setEditingPersona(null);
    setActiveTab('create');
  };

  const handleCreatePersona = async (personaData) => {
    try {
      const res = await fetch(`${API_URL}/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personaData)
      });
      
      if (!res.ok) throw new Error('Failed to create persona');
      
      const data = await res.json();
      setPersonas([...personas, data.persona]);
      setActiveTab('personas');
      setSelectedTemplate(null);
      return data.persona;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdatePersona = async (id, personaData) => {
    try {
      const res = await fetch(`${API_URL}/personas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personaData)
      });
      
      if (!res.ok) throw new Error('Failed to update persona');
      
      const data = await res.json();
      setPersonas(personas.map(p => p.id === id ? data.persona : p));
      setEditingPersona(null);
      return data.persona;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeletePersona = async (id) => {
    if (!confirm('Are you sure you want to delete this persona?')) return;
    
    try {
      const res = await fetch(`${API_URL}/personas/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Failed to delete persona');
      
      setPersonas(personas.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete persona');
    }
  };

  const handleEditPersona = (persona) => {
    setEditingPersona(persona);
    setSelectedTemplate(null);
    setActiveTab('create');
  };

  const handleTestPersona = (persona) => {
    setTestingPersona(persona);
    setActiveTab('preview');
  };

  const handleExportPersona = async (persona) => {
    try {
      const res = await fetch(`${API_URL}/personas/${persona.id}/export`);
      const data = await res.json();
      
      // Trigger download
      const link = document.createElement('a');
      link.href = `http://localhost:3001${data.downloadUrl}`;
      link.download = `${persona.name.replace(/\s+/g, '-').toLowerCase()}-config.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Failed to export persona');
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'templates':
        return (
          <TemplateGallery
            templates={templates}
            onSelect={handleSelectTemplate}
            loading={loading}
          />
        );
      case 'create':
        return (
          <PersonaCreator
            templates={templates}
            selectedTemplate={selectedTemplate}
            editingPersona={editingPersona}
            onCreate={handleCreatePersona}
            onUpdate={handleUpdatePersona}
            onCancel={() => {
              setActiveTab(selectedTemplate ? 'templates' : 'personas');
              setSelectedTemplate(null);
              setEditingPersona(null);
            }}
          />
        );
      case 'personas':
        return (
          <PersonaList
            personas={personas}
            templates={templates}
            onEdit={handleEditPersona}
            onDelete={handleDeletePersona}
            onTest={handleTestPersona}
            onExport={handleExportPersona}
            loading={loading}
            onCreateNew={() => setActiveTab('create')}
          />
        );
      case 'preview':
        return (
          <PreviewTester
            persona={testingPersona}
            templates={templates}
            onBack={() => setActiveTab('personas')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <span className="logo">🎭</span>
          <div>
            <h1>Agent Persona Forge</h1>
            <p>Create, customize, and deploy AI agent personalities</p>
          </div>
        </div>
      </header>

      {error && (
        <div className="alert alert-error" style={{ margin: '1rem 2rem' }}>
          {error}
        </div>
      )}

      <main className="main">
        <nav className="nav">
          <button
            className={`nav-btn ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            📚 Templates
          </button>
          <button
            className={`nav-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => {
              setSelectedTemplate(null);
              setEditingPersona(null);
              setActiveTab('create');
            }}
          >
            ➕ New Persona
          </button>
          <button
            className={`nav-btn ${activeTab === 'personas' ? 'active' : ''}`}
            onClick={() => setActiveTab('personas')}
          >
            👤 My Personas ({personas.length})
          </button>
        </nav>

        <div className="fade-in">
          {renderTab()}
        </div>
      </main>
    </div>
  );
}

export default App;