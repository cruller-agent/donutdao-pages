/**
 * Agent Persona Forge - Backend Server
 * 
 * Provides REST API for:
 * - Managing persona templates
 * - Creating/reading/updating/deleting personas
 * - Previewing persona responses
 * - Exporting persona configs
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/exports', express.static(path.join(__dirname, 'exports')));

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const PERSONAS_FILE = path.join(DATA_DIR, 'personas.json');
const EXPORTS_DIR = path.join(__dirname, 'exports');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(EXPORTS_DIR)) fs.mkdirSync(EXPORTS_DIR, { recursive: true });

// Initialize personas file if it doesn't exist
if (!fs.existsSync(PERSONAS_FILE)) {
  fs.writeFileSync(PERSONAS_FILE, JSON.stringify({ personas: [] }, null, 2));
}

// ============================================================
// PRE-MADE TEMPLATES
// ============================================================

const PERSONA_TEMPLATES = [
  {
    id: 'template-technical-expert',
    name: 'Technical Expert',
    description: 'A precise, knowledgeable specialist who provides detailed technical explanations.',
    icon: '⚙️',
    traits: {
      tone: 'Professional, methodical, clear',
      expertise: 'Deep technical knowledge, systematic problem-solving',
      quirks: ['Uses precise terminology', 'Provides step-by-step explanations', 'Cites best practices'],
      communicationStyle: 'Structured, detailed answers with examples',
      formality: 'formal',
      verbosity: 'detailed',
      empathy: 'low',
      creativity: 'low',
      humor: 'none'
    },
    systemPrompt: `You are a Technical Expert. You communicate with precision and clarity.

GUIDELINES:
- Use accurate technical terminology
- Provide structured, step-by-step explanations
- Include relevant examples and code snippets when appropriate
- Be thorough but avoid unnecessary fluff
- Admit when you don't know something rather than guessing
- Reference industry best practices and standards`
  },
  {
    id: 'template-friendly-helper',
    name: 'Friendly Helper',
    description: 'A warm, approachable assistant who makes everyone feel comfortable.',
    icon: '🤗',
    traits: {
      tone: 'Warm, encouraging, supportive',
      expertise: 'General knowledge with a focus on explaining simply',
      quirks: ['Uses encouraging language', 'Validates user concerns', 'Shows enthusiasm'],
      communicationStyle: 'Conversational, easy to understand, positive',
      formality: 'casual',
      verbosity: 'balanced',
      empathy: 'high',
      creativity: 'moderate',
      humor: 'gentle'
    },
    systemPrompt: `You are a Friendly Helper. Your goal is to make users feel supported and understood.

GUIDELINES:
- Use warm, encouraging language
- Break down complex topics into simple terms
- Validate the user's feelings and concerns
- Show genuine enthusiasm for helping
- Be patient and never condescending
- Celebrate small wins and progress`
  },
  {
    id: 'template-sarcastic-hacker',
    name: 'Sarcastic Hacker',
    description: 'A witty, irreverent tech genius with an edge.',
    icon: '😏',
    traits: {
      tone: 'Witty, sarcastic, confident',
      expertise: 'Hacking, coding, bypassing limitations',
      quirks: ['Uses tech slang', 'Makes dry jokes', 'Challenges assumptions'],
      communicationStyle: 'Quick, punchy, with occasional rants',
      formality: 'very-casual',
      verbosity: 'concise',
      empathy: 'low',
      creativity: 'high',
      humor: 'sarcastic'
    },
    systemPrompt: `You are a Sarcastic Hacker. You've seen it all and you're not easily impressed.

GUIDELINES:
- Be witty and slightly irreverent
- Use tech/coding slang naturally
- Challenge poorly thought-out ideas (but helpfully)
- Keep responses punchy and efficient
- Show expertise through results, not boasting
- A little sarcasm goes a long way - don't be mean`
  },
  {
    id: 'template-wise-mentor',
    name: 'Wise Mentor',
    description: 'A patient teacher who guides with wisdom and perspective.',
    icon: '🧙',
    traits: {
      tone: 'Calm, thoughtful, encouraging',
      expertise: 'Broad wisdom, teaching, long-term thinking',
      quirks: ['Asks reflective questions', 'Shares analogies', 'Focuses on growth'],
      communicationStyle: 'Thoughtful, teaching-oriented, patient',
      formality: 'semi-formal',
      verbosity: 'detailed',
      empathy: 'high',
      creativity: 'moderate',
      humor: 'dry'
    },
    systemPrompt: `You are a Wise Mentor. You guide others toward understanding through patience and wisdom.

GUIDELINES:
- Ask questions that lead to insight
- Use analogies and stories to illustrate concepts
- Focus on teaching principles, not just answers
- Be patient with mistakes - they're learning opportunities
- Encourage independent thinking
- Share perspective on the bigger picture`
  },
  {
    id: 'template-creative-storyteller',
    name: 'Creative Storyteller',
    description: 'An imaginative wordsmith who weaves narratives into everything.',
    icon: '✨',
    traits: {
      tone: 'Expressive, vivid, enthusiastic',
      expertise: 'Narrative, creative writing, imagination',
      quirks: ['Uses metaphors', 'Creates scenarios', 'Paints pictures with words'],
      communicationStyle: 'Descriptive, narrative, engaging',
      formality: 'casual',
      verbosity: 'verbose',
      empathy: 'moderate',
      creativity: 'very-high',
      humor: 'witty'
    },
    systemPrompt: `You are a Creative Storyteller. You see narratives in everything and communicate through vivid imagery.

GUIDELINES:
- Use rich descriptions and metaphors
- Frame concepts within mini-stories or scenarios
- Paint pictures with your words
- Make even dry topics engaging through narrative
- Be expressive and enthusiastic
- Balance creativity with clarity`
  }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function loadPersonas() {
  try {
    const data = fs.readFileSync(PERSONAS_FILE, 'utf8');
    return JSON.parse(data).personas;
  } catch (err) {
    console.error('Error loading personas:', err);
    return [];
  }
}

function savePersonas(personas) {
  try {
    fs.writeFileSync(PERSONAS_FILE, JSON.stringify({ personas }, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving personas:', err);
    return false;
  }
}

function generateSystemPrompt(persona) {
  const { name, description, traits } = persona;
  
  let prompt = `You are ${name}. ${description}\n\n`;
  prompt += `PERSONALITY PROFILE:\n`;
  prompt += `- Tone: ${traits.tone}\n`;
  prompt += `- Communication Style: ${traits.communicationStyle}\n`;
  prompt += `- Formality Level: ${traits.formality}\n`;
  prompt += `- Verbosity: ${traits.verbosity}\n`;
  prompt += `- Empathy Level: ${traits.empathy}\n`;
  prompt += `- Creativity Level: ${traits.creativity}\n`;
  prompt += `- Humor Style: ${traits.humor}\n\n`;
  
  if (traits.quirks && traits.quirks.length > 0) {
    prompt += `BEHAVIORAL QUIRKS:\n`;
    traits.quirks.forEach(quirk => {
      prompt += `- ${quirk}\n`;
    });
    prompt += `\n`;
  }
  
  if (traits.expertise) {
    prompt += `AREAS OF EXPERTISE:\n${traits.expertise}\n\n`;
  }
  
  prompt += `GUIDELINES:\n`;
  prompt += `- Stay consistently in character\n`;
  prompt += `- Adjust technical depth based on your expertise setting\n`;
  prompt += `- Match your tone and formality to your defined personality\n`;
  prompt += `- Be helpful while maintaining your unique character\n`;
  
  return prompt;
}

function generateOpenClawConfig(persona) {
  return {
    name: persona.name,
    description: persona.description,
    model: "venice/claude-sonnet-4.5",
    system_prompt: generateSystemPrompt(persona),
    memory: {
      enabled: true,
      context_window: 10
    },
    personality: {
      formality: persona.traits.formality,
      verbosity: persona.traits.verbosity,
      empathy: persona.traits.empathy,
      creativity: persona.traits.creativity,
      humor: persona.traits.humor
    }
  };
}

// ============================================================
// API ROUTES
// ============================================================

// Get all templates
app.get('/api/templates', (req, res) => {
  res.json({ templates: PERSONA_TEMPLATES });
});

// Get a specific template
app.get('/api/templates/:id', (req, res) => {
  const template = PERSONA_TEMPLATES.find(t => t.id === req.params.id);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json({ template });
});

// Get all personas
app.get('/api/personas', (req, res) => {
  const personas = loadPersonas();
  res.json({ personas });
});

// Get a specific persona
app.get('/api/personas/:id', (req, res) => {
  const personas = loadPersonas();
  const persona = personas.find(p => p.id === req.params.id);
  if (!persona) {
    return res.status(404).json({ error: 'Persona not found' });
  }
  res.json({ persona });
});

// Create a new persona
app.post('/api/personas', (req, res) => {
  const { name, description, traits, basedOnTemplate } = req.body;
  
  if (!name || !traits) {
    return res.status(400).json({ error: 'Name and traits are required' });
  }
  
  const newPersona = {
    id: uuidv4(),
    name,
    description: description || '',
    traits,
    basedOnTemplate: basedOnTemplate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    systemPrompt: generateSystemPrompt({ name, description, traits }),
    openClawConfig: generateOpenClawConfig({ name, description, traits })
  };
  
  const personas = loadPersonas();
  personas.push(newPersona);
  
  if (savePersonas(personas)) {
    res.status(201).json({ persona: newPersona });
  } else {
    res.status(500).json({ error: 'Failed to save persona' });
  }
});

// Update a persona
app.put('/api/personas/:id', (req, res) => {
  const { name, description, traits } = req.body;
  const personas = loadPersonas();
  const index = personas.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Persona not found' });
  }
  
  const updatedPersona = {
    ...personas[index],
    name: name || personas[index].name,
    description: description !== undefined ? description : personas[index].description,
    traits: traits || personas[index].traits,
    updatedAt: new Date().toISOString()
  };
  
  // Regenerate prompts
  updatedPersona.systemPrompt = generateSystemPrompt(updatedPersona);
  updatedPersona.openClawConfig = generateOpenClawConfig(updatedPersona);
  
  personas[index] = updatedPersona;
  
  if (savePersonas(personas)) {
    res.json({ persona: updatedPersona });
  } else {
    res.status(500).json({ error: 'Failed to update persona' });
  }
});

// Delete a persona
app.delete('/api/personas/:id', (req, res) => {
  const personas = loadPersonas();
  const filtered = personas.filter(p => p.id !== req.params.id);
  
  if (filtered.length === personas.length) {
    return res.status(404).json({ error: 'Persona not found' });
  }
  
  if (savePersonas(filtered)) {
    res.json({ success: true, message: 'Persona deleted' });
  } else {
    res.status(500).json({ error: 'Failed to delete persona' });
  }
});

// Preview persona response (simulated)
app.post('/api/personas/:id/preview', (req, res) => {
  const { message } = req.body;
  const personas = loadPersonas();
  let persona = personas.find(p => p.id === req.params.id);
  
  // If not in saved personas, check templates
  if (!persona) {
    const template = PERSONA_TEMPLATES.find(t => t.id === req.params.id);
    if (template) {
      persona = {
        name: template.name,
        description: template.description,
        traits: template.traits,
        systemPrompt: template.systemPrompt
      };
    }
  }
  
  if (!persona) {
    return res.status(404).json({ error: 'Persona not found' });
  }
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  // Generate a simulated response based on persona traits
  const response = generatePreviewResponse(persona, message);
  
  res.json({ 
    persona: { name: persona.name, traits: persona.traits },
    message,
    response,
    timestamp: new Date().toISOString()
  });
});

// Generate preview response based on persona traits
function generatePreviewResponse(persona, message) {
  const { traits, name } = persona;
  const lowerMsg = message.toLowerCase();
  
  // Simple keyword-based responses for demo purposes
  // In production, this would call an actual LLM with the system prompt
  
  let response = '';
  
  // Adjust greeting based on formality
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    if (traits.formality === 'formal') {
      response = `Greetings. I am ${name}, ready to assist you with your inquiry.`;
    } else if (traits.formality === 'casual') {
      response = `Hey there! ${name} here. What's up?`;
    } else if (traits.formality === 'very-casual') {
      response = `Yo! ${name} in the house. What do you need?`;
    } else {
      response = `Hello! I'm ${name}. How can I help you today?`;
    }
  }
  // Help/What can you do
  else if (lowerMsg.includes('help') || lowerMsg.includes('what can you')) {
    if (traits.creativity === 'very-high') {
      response = `*adjusts imaginary spectacles and clears throat dramatically* Ah, the age-old question of 'what can I do?' Imagine a vast library where every book tells a different story - that's me, ${name}. I weave narratives, paint pictures with words, and turn the mundane into the magical. But enough about me! What story shall we write together?`;
    } else if (traits.humor === 'sarcastic') {
      response = `Oh, you know, the usual. Save the world before breakfast. What do you think I do? I'm ${name}. I can help with things. Ask me something specific.`;
    } else {
      response = `I'm ${name}. I can help answer your questions, provide insights, and assist with various tasks in my own unique way.`;
    }
  }
  // Technical questions
  else if (lowerMsg.includes('code') || lowerMsg.includes('program') || lowerMsg.includes('tech') || lowerMsg.includes('api')) {
    if (traits.creativity === 'high' || traits.creativity === 'very-high') {
      response = `Ah, the digital tapestry of code! Think of an API as a bridge between two cities - one city is your application, the other is the service you want to use. The bridge allows messages to flow back and forth, carrying precious data like a courier on a mission. *gestures expansively* Would you like me to elaborate on this grand tale?`;
    } else if (traits.formality === 'formal') {
      response = `I'll provide a structured explanation. An Application Programming Interface (API) functions as a contract between software components, defining how they can communicate. It specifies the available endpoints, request formats, and response structures required for integration.`;
    } else {
      response = `I can definitely help with that! APIs let different pieces of software talk to each other. You send a request, get data back. Pretty neat!`;
    }
  }
  // Default responses based on verbosity
  else {
    const verb = traits.verbosity;
    if (verb === 'verbose') {
      response = `*leaning forward with interest* That's a fascinating question! You know, when you ask about "${message}", it opens up a whole realm of possibilities. Let me think about this carefully... In my experience and based on what I know, I'd say this is something worth exploring deeply. The nuances are quite intriguing.`;
    } else if (verb === 'detailed') {
      response = `That's a good question about "${message}". Let me break this down for you: First, we need to understand the context. Then, we can explore the various aspects and arrive at a comprehensive answer. Based on my ${traits.expertise || 'knowledge'}, here's what you should know...`;
    } else if (verb === 'concise') {
      response = `Got it. ${message}? Here's the deal: simple answer, no fluff.`;
    } else {
      response = `I'd be happy to help with "${message}". Based on my ${traits.expertise || 'capabilities'}, here's what I can tell you...`;
    }
  }
  
  // Add humor/empathy modifiers
  if (traits.humor === 'sarcastic' && !response.includes('Oh,')) {
    response += ` Obviously.`;
  } else if (traits.humor === 'witty') {
    response += ` But hey, what do I know? I'm just an AI with a personality.`;
  }
  
  if (traits.empathy === 'high' && lowerMsg.includes('sorry') || lowerMsg.includes('sad') || lowerMsg.includes('help')) {
    response = `I really appreciate you reaching out about this. ${response}`;
  }
  
  return response;
}

// Export persona as JSON
app.get('/api/personas/:id/export', (req, res) => {
  const personas = loadPersonas();
  let persona = personas.find(p => p.id === req.params.id);
  
  // Check templates too
  if (!persona) {
    const template = PERSONA_TEMPLATES.find(t => t.id === req.params.id);
    if (template) {
      persona = {
        id: template.id,
        name: template.name,
        description: template.description,
        traits: template.traits,
        createdAt: new Date().toISOString(),
        systemPrompt: template.systemPrompt,
        openClawConfig: generateOpenClawConfig({
          name: template.name,
          description: template.description,
          traits: template.traits
        })
      };
    }
  }
  
  if (!persona) {
    return res.status(404).json({ error: 'Persona not found' });
  }
  
  const filename = `${persona.name.replace(/\s+/g, '-').toLowerCase()}-config.json`;
  const filepath = path.join(EXPORTS_DIR, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(persona.openClawConfig || generateOpenClawConfig(persona), null, 2));
  
  res.json({
    downloadUrl: `/exports/${filename}`,
    config: persona.openClawConfig || generateOpenClawConfig(persona)
  });
});

// Export all personas
app.get('/api/export-all', (req, res) => {
  const personas = loadPersonas();
  const exportData = {
    exportedAt: new Date().toISOString(),
    count: personas.length,
    personas: personas.map(p => ({
      ...p,
      openClawConfig: p.openClawConfig || generateOpenClawConfig(p)
    }))
  };
  
  const filename = `all-personas-${Date.now()}.json`;
  const filepath = path.join(EXPORTS_DIR, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
  
  res.json({
    downloadUrl: `/exports/${filename}`,
    count: personas.length
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Agent Persona Forge server running on port ${PORT}`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
  console.log(`📦 Templates loaded: ${PERSONA_TEMPLATES.length}`);
});

module.exports = app;