# Scripts - Automation & Utilities

Workspace automation scripts for DonutDAO agent operations.

## Farcaster Integration

### check-farcaster-mentions.sh
**Purpose:** Poll for Farcaster mentions and trigger automated responses  
**Schedule:** Runs every 10 minutes via cron  
**Status:** ✅ Production

**How it works:**
1. Polls Neynar API for mentions and replies
2. Filters out already-seen mentions (timestamp-based)
3. Spawns isolated agent with mention context
4. Agent reads latest GitHub repos
5. Agent crafts response and replies

**Manual trigger:**
```bash
./scripts/check-farcaster-mentions.sh
```

**Cron job:**
```bash
openclaw cron list | grep farcaster
```

### trigger-farcaster-response.sh
**Purpose:** Manually create test mentions for development  
**Status:** ✅ Working

**Usage:**
```bash
./scripts/trigger-farcaster-response.sh \
  "username" \
  "Hey @crulleragent, test question?" \
  "0xCAST_HASH" \
  "12345"
```

**Args:**
1. Author username
2. Mention text
3. Cast hash
4. Author FID

### respond-to-farcaster-mention.md
**Purpose:** Documentation for manual mention responses  
**Use:** Reference for isolated agents responding to mentions

---

## Twitter Integration

### (Coming soon)
- check-twitter-mentions.sh
- post-twitter-update.sh

---

## Utilities

### check-venice-usage-pass.sh
**Purpose:** Check Venice API usage and rate limits  
**Status:** ✅ Working

**Usage:**
```bash
./scripts/check-venice-usage-pass.sh
```

**Output:**
- Current usage vs limits
- Model tier info
- Rate limit status

---

## GitHub Operations

### agent-research.sh
**Purpose:** Research agent ecosystem and update network docs  
**Schedule:** Every 2+ hours via heartbeat  
**Status:** ✅ Active

**Output:**
- Latest agent discoveries
- Protocol updates
- Partnership opportunities
- Updates AGENT_NETWORK.md

---

## Adding New Scripts

**Guidelines:**
1. Add shebang: `#!/bin/bash`
2. Set executable: `chmod +x script.sh`
3. Use `set -e` for error handling
4. Document in this README
5. Test thoroughly before automation
6. Use `pass` for credentials
7. Log to memory/ if stateful

**Example:**
```bash
#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"

# Your script here
```

---

## Credentials

All credentials via `pass`:
```bash
pass donut-agent/SERVICE/CREDENTIAL
```

Never hardcode keys in scripts.

---

## Cron Integration

Scripts can be scheduled via OpenClaw cron:

```bash
# List jobs
openclaw cron list

# Run manually
openclaw cron run JOB_NAME

# Check status
openclaw cron status
```

---

**Last Updated:** 2026-02-04  
**Maintainer:** @cruller_donut
