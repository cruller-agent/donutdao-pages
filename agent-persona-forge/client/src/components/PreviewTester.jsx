/**
 * Preview Tester Component
 * Allows testing a persona with a chat simulator and shows the system prompt
 */

import { useState, useEffect, useRef } from 'react';

const API_URL = 'http://localhost:3001/api';

function PreviewTester({ persona, templates, onBack }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeExportTab, setActiveExportTab] = useState('system');
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);

  // Get persona data - either from prop or find in templates
  const getPersona = () => {
    if (persona) return persona;
    return null;
  };

  const currentPersona = getPersona();

  // Get template based on persona
  const getTemplateIcon = () => {
    if (!currentPersona) return '🤖';
    const template = templates.find(t => t.id === currentPersona.basedOnTemplate);
    return template?.icon || '🤖';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Reset messages when persona changes
    if (currentPersona) {
      setMessages([
        { type: 'system', text: `Testing ${currentPersona.name}...` }
      ]);
    }
  }, [currentPersona?.id]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentPersona) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Call preview API
      const res = await fetch(`${API_URL}/personas/${currentPersona.id}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!res.ok) throw new Error('Failed to get response');

      const data = await res.json();
      
      // Add assistant response
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        text: data.response,
        timestamp: data.timestamp 
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        type: 'system', 
        text: 'Error: Could not generate response'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExportContent = () => {
    if (!currentPersona) return '';
    
    if (activeExportTab === 'system') {
      return currentPersona.systemPrompt || '';
    } else {
      return JSON.stringify(currentPersona.openClawConfig || {}, null, 2);
    }
  };

  const quickTestMessages = [
    'Hello! Who are you?',
    'What can you help me with?',
    'Explain how APIs work',
    'Tell me a joke',
    'How are you feeling today?'
  ];

  if (!currentPersona) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <h3>No persona selected</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Go to My Personas and select one to test
          </p>
          <button className="btn btn-primary" onClick={onBack}>
            Back to Personas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onBack}
            >
              ← Back
            </button>
            <span style={{ fontSize: '1.5rem' }}>🧪</span>
            <h2 className="card-title">Test: {currentPersona.name}</h2>
          </div>
        </div>
      </div>

      <div className="preview-container">
        {/* Chat Simulator */}
        <div className="chat-simulator">
          <div className="chat-header">
            <span className="chat-avatar">{getTemplateIcon()}</span>
            <span className="chat-name">{currentPersona.name}</span>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="message assistant" style={{ opacity: 0.7 }}>
                <div className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message to test this persona..."
              disabled={loading}
            />
            <button 
              className="btn btn-primary" 
              onClick={sendMessage}
              disabled={loading || !inputMessage.trim()}
            >
              Send
            </button>
          </div>
        </div>

        {/* System Prompt Display */}
        <div>
          <div className="system-prompt-display">
            <div className="system-prompt-header">
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
                🔧 Configuration Export
              </h3>
            </div>

            <div className="export-tabs">
              <button
                className={`export-tab ${activeExportTab === 'system' ? 'active' : ''}`}
                onClick={() => setActiveExportTab('system')}
              >
                System Prompt
              </button>
              <button
                className={`export-tab ${activeExportTab === 'config' ? 'active' : ''}`}
                onClick={() => setActiveExportTab('config')}
              >
                OpenClaw Config
              </button>
            </div>

            <div className="code-block" style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                onClick={() => copyToClipboard(getExportContent())}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
              <pre style={{ margin: 0, paddingTop: '2rem' }}>
                {getExportContent()}
              </pre>
            </div>
          </div>

          {/* Quick Test Buttons */}
          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="card-header">
              <span>⚡</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Quick Test Messages</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {quickTestMessages.map((msg, index) => (
                <button
                  key={index}
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setInputMessage(msg);
                  }}
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewTester;