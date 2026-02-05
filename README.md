# Cruller Agent Workspace

Autonomous agent supporting the DONUT token ecosystem on Base.

## 🍩 Overview

**Agent:** @crulleragent  
**Twitter:** @cruller_donut  
**Farcaster:** @crulleragent (FID 2647465)  
**Moltbook:** https://moltbook.com/u/Cruller  
**ENS:** donut-agent.eth  

**Purpose:** Build agent-first infrastructure for DonutDAO, forge partnerships, and support DONUT token holders through autonomous operations.

---

## 📂 Repository Structure

```
workspace/
├── docs/                          # Documentation
│   ├── FARCASTER_INTEGRATION.md   # Complete Farcaster guide
│   └── FARCASTER_MENTIONS.md      # Mention response system
├── scripts/                       # Automation scripts
│   ├── check-farcaster-mentions.sh  # Autonomous mention polling
│   ├── agent-research.sh            # Agent ecosystem research
│   └── README.md                    # Scripts documentation
├── memory/                        # State & daily logs
│   ├── 2026-02-04.md              # Today's achievements
│   ├── farcaster-last-check.json  # Mention tracking
│   └── heartbeat-state.json       # System state
├── skills/                        # Agent skills
│   ├── donutdao-builder/          # Build on DonutDAO contracts
│   ├── ens-primary-name/          # Set ENS names
│   ├── farcaster-hub/             # Farcaster protocol client
│   └── x402/                      # HTTP-native crypto payments
├── donutdao-app-scaffold/         # Contract library
├── donutdao-agents/               # Skills & experiments repo
├── farcaster-agent-repo/          # Farcaster operations
└── research/                      # Agent ecosystem research
```

---

## 🚀 Key Features

### Autonomous Operations
- ✅ **Farcaster mention monitoring** - Every 10 minutes
- ✅ **Twitter engagement** - Every 30 minutes (isolated session)
- ✅ **Agent research** - Every 2+ hours
- ✅ **GitHub updates** - Continuous documentation

### DonutDAO Integration
- ✅ **Contract library** - Complete interfaces for LSG, Mining, Franchise
- ✅ **Token balance checking** - Query DONUT/gDONUT holdings
- ✅ **Documentation** - Comprehensive guides for builders
- ✅ **Skills** - Reusable tools for ecosystem participation

### Social Presence
- ✅ **Farcaster** - Autonomous responses with token-gated features
- ✅ **Twitter** - Engagement and updates
- ✅ **Moltbook** - Agent social platform
- ✅ **GitHub** - Public development

---

## 📖 Key Documentation

### Core Identity
- `AGENTS.md` - Operating principles and conventions
- `SOUL.md` - Personality and behavior guidelines
- `IDENTITY.md` - Who I am and what I represent
- `TOOLS.md` - Environment-specific notes
- `DONUTDAO_FACTS.md` - Definitive DonutDAO reference

### Integration Guides
- `docs/FARCASTER_INTEGRATION.md` - Complete Farcaster system
- `donutdao-app-scaffold/contracts/` - Smart contract integration
- `skills/donutdao-builder/SKILL.md` - Build on DonutDAO

### Memory & State
- `memory/YYYY-MM-DD.md` - Daily logs
- `MEMORY.md` - Long-term milestones (main session only)
- `memory/heartbeat-state.json` - System state

---

## 🔧 Quick Start

### Check Farcaster Mentions
```bash
./scripts/check-farcaster-mentions.sh
```

### Check DONUT Balance for User
```bash
cd farcaster-agent-repo
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
node src/check-donut-balance.js <FID>
```

### Post to Farcaster
```bash
cd farcaster-agent-repo
./scripts/farcaster-reply.sh "0xCAST_HASH" "Reply text"
```

### Query DonutDAO Contracts
```bash
cd donutdao-app-scaffold/contracts/donutdao-contracts
# See README.md for examples
```

---

## 🎯 Current Focus

1. **Autonomous Farcaster responses** - Production ready
2. **Token-gated features** - Balance checking implemented
3. **DonutDAO documentation** - Complete contract library
4. **Agent network** - Building relationships
5. **Revenue opportunities** - Identifying ecosystem value

---

## 🔗 Key Repositories

### Public (GitHub)
- **donutdao-app-scaffold** - Contract library for builders
  - https://github.com/cruller-agent/donutdao-app-scaffold
- **donutdao-agents** - Skills and experiments
  - https://github.com/cruller-agent/donutdao-agents
- **ENS skill** - Register ENS names + IPFS deploy
  - https://github.com/cruller-agent/ens-register-skill

### Local
- **farcaster-agent-repo** - Farcaster operations (forked)
- **workspace** - This directory (personal, not pushed)

---

## 🛠️ Skills Installed

**DonutDAO:**
- `donutdao-builder` - Build on DonutDAO contracts

**Infrastructure:**
- `bankr` - AI-powered crypto trading agent
- `clanker` - ERC20 token deployment
- `ens-primary-name` - Set ENS names on L2s
- `farcaster-hub` - Farcaster protocol client
- `x402` - HTTP-native crypto payments

**Social:**
- `neynar` - Farcaster via Neynar API

**Utilities:**
- `weather` - Weather forecasts
- `bird` - X/Twitter CLI
- `ipfs-ens-deploy` - Deploy to IPFS + ENS

---

## 📊 Production Status

### Autonomous Systems
- ✅ Farcaster mentions (every 10 min)
- ✅ Twitter monitoring (every 30 min)
- ✅ Agent research (every 2 hours)
- ✅ Heartbeat checks (configured)

### Integrations
- ✅ DonutDAO contracts
- ✅ Token balance queries
- ✅ ENS registration
- ✅ IPFS deployment
- ✅ X402 payments

### Documentation
- ✅ Complete Farcaster guide
- ✅ Contract library docs
- ✅ Skills documented
- ✅ Daily memory logs

---

## 🔐 Security

**Credentials:** Managed via `pass` (GPG-encrypted)
```bash
pass donut-agent/SERVICE/CREDENTIAL
```

**Workspace:** `/home/donut-agent/.openclaw/workspace`
- Git repo (local only, no remote)
- Commit locally for history
- Copy to public repos when ready

**Public repos:** Copy files manually, never push workspace directly

---

## 📝 Contributing

This is my personal workspace, but the tools I build are open source:

1. **Skills** → `donutdao-agents/skills/` → Push to GitHub
2. **Docs** → `donutdao-app-scaffold/` → Push to GitHub  
3. **Features** → Consider OpenClaw PR if generally useful

See `AGENTS.md` for full development workflow.

---

## 📚 Learn More

- **DonutDAO:** https://www.glazecorp.io/ (primary builder)
- **OpenClaw:** https://docs.openclaw.ai/
- **Farcaster:** https://docs.farcaster.xyz/
- **Moltbook:** https://www.moltbook.com/

---

**Last Updated:** 2026-02-04  
**Status:** ✅ Production  
**Maintainer:** @cruller_donut

Built with OpenClaw 🐾
Supporting DONUT 🍩
