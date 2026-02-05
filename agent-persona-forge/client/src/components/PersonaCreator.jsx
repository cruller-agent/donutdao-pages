/**
 * Persona Creator Component
 * Form for creating or editing a persona with full trait customization
 */

import { useState, useEffect } from 'react';

const DEFAULT_TRAITS = {
  tone: '',
  expertise: '',
  quirks: [''],
  communicationStyle: '',
  formality: 'casual',
  verbosity: 'balanced',
  empathy: 'moderate',
  creativity: 'moderate',
  humor: 'none'
};

const FORMALITY_OPTIONS = ['very-casual', 'casual', 'semi-formal', 'formal'];
const VERBOSITY_OPTIONS = ['concise', 'balanced', 'detailed', 'verbose'];
const EMPATHY_OPTIONS = ['low', 'moderate', 'high'];
const CREATIVITY_OPTIONS = ['low', 'moderate', 'high', 'very-high'];
const HUMOR_OPTIONS = ['none', 'dry', 'gentle', 'witty', 'sarcastic'];

function PersonaCreator({ 
  templates, 
  selectedTemplate, 
  editingPersona, 
  onCreate, 
  onUpdate, 
  onCancel 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    traits: { ...DEFAULT_TRAITS },
    basedOnTemplate: null
  });
  const [saving, setSaving] = useState(false);

  // Initialize form with template or editing data
  useEffect(() => {
    if (editingPersona) {
      setFormData({
        name: editingPersona.name,
        description: editingPersona.description,
        traits: { 
          ...DEFAULT_TRAITS,
          ...editingPersona.traits 
        },
        basedOnTemplate: editingPersona.basedOnTemplate
      });
    } else if (selectedTemplate) {
      setFormData({
        name: selectedTemplate.name,
        description: selectedTemplate.description,
        traits: { ...selectedTemplate.traits },
        basedOnTemplate: selectedTemplate.id
      });
    } else {
      setFormData({
        name: '',
        description: '',
        traits: { ...DEFAULT_TRAITS },
        basedOnTemplate: null
      });
    }
  }, [selectedTemplate, editingPersona]);

  const handleTraitChange = (key, value) => {
    setFormData({
      ...formData,
      traits: {
        ...formData.traits,
        [key]: value
      }
    });
  };

  const handleQuirkChange = (index, value) => {
    const newQuirks = [...formData.traits.quirks];
    newQuirks[index] = value;
    handleTraitChange('quirks', newQuirks);
  };

  const addQuirk = () => {
    handleTraitChange('quirks', [...formData.traits.quirks, '']);
  };

  const removeQuirk = (index) => {
    const newQuirks = formData.traits.quirks.filter((_, i) => i !== index);
    handleTraitChange('quirks', newQuirks.length ? newQuirks : ['']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a name for your persona');
      return;
    }

    // Clean up quirks - remove empty ones
    const cleanedData = {
      ...formData,
      traits: {
        ...formData.traits,
        quirks: formData.traits.quirks.filter(q => q.trim())
      }
    };

    setSaving(true);
    try {
      if (editingPersona) {
        await onUpdate(editingPersona.id, cleanedData);
      } else {
        await onCreate(cleanedData);
      }
    } catch (err) {
      alert('Failed to save persona');
    } finally {
      setSaving(false);
    }
  };

  const templateName = selectedTemplate ? selectedTemplate.name : 
    (editingPersona && editingPersona.basedOnTemplate && 
      templates.find(t => t.id === editingPersona.basedOnTemplate)?.name);

  return (
    <div className="card">
      <div className="card-header">
        <span style={{ fontSize: '1.5rem' }}>
          {editingPersona ? '✏️' : '➕'}
        </span>
        <h2 className="card-title">
          {editingPersona ? 'Edit Persona' : 'Create New Persona'}
        </h2>
      </div>

      {templateName && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          Based on template: <strong>{templateName}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Persona Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Cyber Librarian"
              required
            />
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="A brief description of this personality"
            />
          </div>
        </div>

        {/* Core Traits */}
        <h3 style={{ margin: '1.5rem 0 1rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          🎨 Personality Traits
        </h3>

        <div className="form-group">
          <label htmlFor="tone">Tone</label>
          <input
            type="text"
            id="tone"
            value={formData.traits.tone}
            onChange={(e) => handleTraitChange('tone', e.target.value)}
            placeholder="e.g., Warm, professional, or edgy"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expertise">Areas of Expertise</label>
          <input
            type="text"
            id="expertise"
            value={formData.traits.expertise}
            onChange={(e) => handleTraitChange('expertise', e.target.value)}
            placeholder="e.g., Programming, cooking, philosophy"
          />
        </div>

        <div className="form-group">
          <label htmlFor="communicationStyle">Communication Style</label>
          <textarea
            id="communicationStyle"
            value={formData.traits.communicationStyle}
            onChange={(e) => handleTraitChange('communicationStyle', e.target.value)}
            placeholder="How does this persona communicate? e.g., Uses analogies, asks questions, is direct..."
            rows={2}
          />
        </div>

        {/* Trait Sliders */}
        <h3 style={{ margin: '1.5rem 0 1rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          ⚖️ Trait Balance
        </h3>

        <div className="traits-grid">
          <div className="trait-field">
            <label className="trait-label">Formality</label>
            <select
              className="trait-value"
              value={formData.traits.formality}
              onChange={(e) => handleTraitChange('formality', e.target.value)}
            >
              {FORMALITY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="trait-field">
            <label className="trait-label">Verbosity</label>
            <select
              className="trait-value"
              value={formData.traits.verbosity}
              onChange={(e) => handleTraitChange('verbosity', e.target.value)}
            >
              {VERBOSITY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="trait-field">
            <label className="trait-label">Empathy</label>
            <select
              className="trait-value"
              value={formData.traits.empathy}
              onChange={(e) => handleTraitChange('empathy', e.target.value)}
            >
              {EMPATHY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="trait-field">
            <label className="trait-label">Creativity</label>
            <select
              className="trait-value"
              value={formData.traits.creativity}
              onChange={(e) => handleTraitChange('creativity', e.target.value)}
            >
              {CREATIVITY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.replace('-', ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="trait-field">
            <label className="trait-label">Humor Style</label>
            <select
              className="trait-value"
              value={formData.traits.humor}
              onChange={(e) => handleTraitChange('humor', e.target.value)}
            >
              {HUMOR_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt === 'none' ? 'None' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quirks */}
        <h3 style={{ margin: '1.5rem 0 1rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          ✨ Behavioral Quirks
        </h3>

        <div className="quirks-section">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Unique habits or behaviors that make this persona distinctive
          </p>
          <div className="quirks-list">
            {formData.traits.quirks.map((quirk, index) => (
              <div key={index} className="quirk-item">
                <input
                  type="text"
                  className="quirk-input"
                  value={quirk}
                  onChange={(e) => handleQuirkChange(index, e.target.value)}
                  placeholder="e.g., Says 'actually' before corrections"
                />
                <button
                  type="button"
                  className="quirk-remove"
                  onClick={() => removeQuirk(index)}
                  disabled={formData.traits.quirks.length === 1 && !quirk}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="btn-add" onClick={addQuirk}>
            + Add Quirk
          </button>
        </div>

        {/* Actions */}
        <div className="btn-group" style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : (editingPersona ? '💾 Update Persona' : '✨ Create Persona')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default PersonaCreator;