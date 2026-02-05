/**
 * Persona List Component
 * Displays all saved personas with actions
 */

function PersonaList({ 
  personas, 
  templates, 
  onEdit, 
  onDelete, 
  onTest, 
  onExport, 
  loading,
  onCreateNew 
}) {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading personas...</p>
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">👤</div>
        <h3>No personas yet</h3>
        <p style={{ marginBottom: '1.5rem' }}>
          Create your first AI personality to get started
        </p>
        <button className="btn btn-primary" onClick={onCreateNew}>
          Create Persona
        </button>
      </div>
    );
  }

  const getTemplateName = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : null;
  };

  return (
    <div className="card">
      <div className="card-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>👤</span>
          <h2 className="card-title">My Personas ({personas.length})</h2>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onCreateNew}>
          ➕ New
        </button>
      </div>

      <div className="personas-list">
        {personas.map((persona) => (
          <div key={persona.id} className="persona-card">
            <div className="persona-card-header">
              <div>
                <h3 className="persona-card-title">{persona.name}</h3>
                {persona.basedOnTemplate && getTemplateName(persona.basedOnTemplate) && (
                  <span className="trait-badge">
                    Based on: {getTemplateName(persona.basedOnTemplate)}
                  </span>
                )}
              </div>
            </div>

            {persona.description && (
              <p className="persona-card-desc">{persona.description}</p>
            )}

            <div className="persona-traits-preview">
              <span className="trait-badge">{persona.traits.formality}</span>
              <span className="trait-badge">{persona.traits.verbosity}</span>
              <span className="trait-badge">
                {persona.traits.empathy} empathy
              </span>
              <span className="trait-badge">
                {persona.traits.humor} humor
              </span>
            </div>

            <div className="persona-card-actions">
              <button 
                className="btn btn-primary btn-sm" 
                onClick={() => onTest(persona)}
              >
                🧪 Test
              </button>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => onEdit(persona)}
              >
                ✏️ Edit
              </button>
              <button 
                className="btn btn-success btn-sm" 
                onClick={() => onExport(persona)}
              >
                📥 Export
              </button>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={() => onDelete(persona.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PersonaList;