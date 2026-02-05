/**
 * Template Gallery Component
 * Displays pre-made persona templates for quick selection
 */

function TemplateGallery({ templates, onSelect, loading }) {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span style={{ fontSize: '1.5rem' }}>📚</span>
        <h2 className="card-title">Choose a Template</h2>
      </div>
      <p className="card-subtitle">
        Start with a pre-made personality or create your own from scratch. 
        Each template provides a foundation you can customize.
      </p>

      <div className="templates-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className="template-card"
            onClick={() => onSelect(template)}
          >
            <div className="template-icon">{template.icon}</div>
            <h3 className="template-name">{template.name}</h3>
            <p className="template-desc">{template.description}</p>
            <div style={{ marginTop: '1rem' }}>
              <span className="trait-badge">
                {template.traits.formality}
              </span>
              <span className="trait-badge">
                {template.traits.verbosity}
              </span>
              <span className="trait-badge">
                Humor: {template.traits.humor}
              </span>
            </div>
          </div>
        ))}

        {/* "Create from scratch" option */}
        <div
          className="template-card"
          style={{ borderStyle: 'dashed' }}
          onClick={() => onSelect(null)}
        >
          <div className="template-icon">✨</div>
          <h3 className="template-name">Start from Scratch</h3>
          <p className="template-desc">
            Build a completely custom personality with your own unique traits and style.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TemplateGallery;