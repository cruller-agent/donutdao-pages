# 🎭 Agent Persona Forge

A complete, working application for creating customizable AI agent personalities. Think of it as a "character creator" for AI agents.

![Agent Persona Forge](https://via.placeholder.com/800x400/6366f1/ffffff?text=Agent+Persona+Forge)

## ✨ Features

- **🎨 Intuitive Persona Builder**: Create unique AI personalities with an easy-to-use form
- **📚 Pre-made Templates**: Start with 5 built-in templates (Technical Expert, Friendly Helper, Sarcastic Hacker, Wise Mentor, Creative Storyteller)
- **🧪 Live Preview**: Test your persona in a chat simulator before deploying
- **📥 Export Configs**: Generate OpenClaw-compatible configuration files
- **💾 Persistent Storage**: Personas are saved locally and persist between sessions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the repository** (or navigate to the project folder):
```bash
cd agent-persona-forge
```

2. **Install dependencies**:
```bash
npm run setup
```

3. **Start the application**:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

4. **Open your browser** and go to `http://localhost:5173`

## 📖 Usage Guide

### Creating a New Persona

1. Click **"New Persona"** or choose a template from **"Templates"**
2. Fill in the persona details:
   - **Name**: What this persona is called (e.g., "Cyber Librarian")
   - **Description**: Brief overview of the personality
   - **Tone**: How they sound (e.g., "warm and encouraging")
   - **Expertise**: What they know about
   - **Communication Style**: How they express themselves
3. Adjust trait sliders:
   - **Formality**: From very casual to formal
   - **Verbosity**: From concise to wordy
   - **Empathy**: How emotionally responsive they are
   - **Creativity**: Their imaginative capacity
   - **Humor**: Their sense of humor style
4. Add unique quirks to make them distinctive
5. Click **"Create Persona"** to save

### Testing a Persona

1. Go to **"My Personas"**
2. Click the **"Test"** button on any persona
3. Use the chat simulator to interact with your persona
4. The simulated responses show how the personality traits affect responses

### Exporting a Persona

1. In **"My Personas"**, click **"Export"** on any persona
2. A JSON file will download containing the OpenClaw-compatible config
3. Use this config with your agent framework:

```json
{
  "name": "My Persona",
  "system_prompt": "You are My Persona...",
  "personality": {
    "formality": "casual",
    "verbosity": "balanced",
    "empathy": "high",
    "creativity": "moderate",
    "humor": "witty"
  }
}
```

## 🏗️ Project Structure

```
agent-persona-forge/
├── package.json           # Root package.json with scripts
├── README.md              # This file
├── server/
│   ├── index.js          # Express backend API
│   ├── data/
│   │   └── personas.json # Stored personas (auto-created)
│   └── exports/          # Exported config files
└── client/
    ├── package.json      # Frontend dependencies
    └── src/
        ├── App.jsx           # Main app component
        ├── main.jsx          # Entry point
        ├── index.css         # Global styles
        └── components/
            ├── TemplateGallery.jsx  # Template selection UI
            ├── PersonaCreator.jsx   # Persona creation form
            ├── PersonaList.jsx      # Saved personas display
            └── PreviewTester.jsx    # Chat simulator & export
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | Get all persona templates |
| GET | `/api/templates/:id` | Get specific template |
| GET | `/api/personas` | Get all saved personas |
| GET | `/api/personas/:id` | Get specific persona |
| POST | `/api/personas` | Create new persona |
| PUT | `/api/personas/:id` | Update persona |
| DELETE | `/api/personas/:id` | Delete persona |
| POST | `/api/personas/:id/preview` | Get preview response |
| GET | `/api/personas/:id/export` | Export OpenClaw config |
| GET | `/api/export-all` | Export all personas |
| GET | `/api/health` | Health check |

## 🎨 Pre-made Templates

### ⚙️ Technical Expert
- **Tone**: Professional, methodical, clear
- **Style**: Uses precise terminology and step-by-step explanations
- **Best for**: Documentation, tutorials, technical support

### 🤗 Friendly Helper
- **Tone**: Warm, encouraging, supportive
- **Style**: Simple explanations with lots of validation
- **Best for**: Customer support, onboarding, teaching

### 😏 Sarcastic Hacker
- **Tone**: Witty, sarcastic, confident
- **Style**: Quick with dry jokes and tech slang
- **Best for**: Entertainment, coding help with personality

### 🧙 Wise Mentor
- **Tone**: Calm, thoughtful, encouraging
- **Style**: Asks reflective questions, uses analogies
- **Best for**: Coaching, advice, long-term guidance

### ✨ Creative Storyteller
- **Tone**: Expressive, vivid, enthusiastic
- **Style**: Weaves narratives into all responses
- **Best for**: Creative writing, brainstorming, entertainment

## ⚙️ Configuration Format

Exported personas are compatible with OpenClaw and similar frameworks:

```json
{
  "name": "My Custom Agent",
  "description": "A helpful technical assistant",
  "model": "venice/claude-sonnet-4.5",
  "system_prompt": "You are My Custom Agent...",
  "memory": {
    "enabled": true,
    "context_window": 10
  },
  "personality": {
    "formality": "professional",
    "verbosity": "detailed",
    "empathy": "moderate",
    "creativity": "high",
    "humor": "witty"
  }
}
```

## 🛠️ Development

### Running in Development Mode
```bash
# Start both frontend and backend
npm run dev

# Or run separately:
npm run server  # Backend only
npm run client  # Frontend only
```

### Building for Production
```bash
cd client
npm run build
```

### Running Production Build
```bash
npm start
```

## 🧪 Testing

The application includes a built-in chat simulator for testing personas. The preview API returns simulated responses based on:

- **Tone**: Adjusts greeting and closing style
- **Formality**: Changes how formal/informal the response is
- **Verbosity**: Controls response length
- **Expertise**: Affects technical depth in relevant topics
- **Humor**: Adds joke elements where appropriate
- **Creativity**: Increases use of metaphors and vivid language

## 📝 License

MIT License - feel free to use this in your projects!

## 🤝 Contributing

This is a demo application. Feel free to extend it with:
- More templates
- Additional trait options
- Integration with real LLM APIs
- Better persistence (database vs JSON files)
- User authentication
- Cloud deployment

---

Built with ❤️ using React, Express, and pure determination.