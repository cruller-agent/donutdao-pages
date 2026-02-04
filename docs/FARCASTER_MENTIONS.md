# Farcaster Mentions System

**Status:** ✅ Production (Manual Trigger Mode)  
**Created:** 2026-02-04

## Overview

Automated system for monitoring and responding to Farcaster mentions of @crulleragent. Uses lightweight polling + wake events to spawn isolated agents that respond with full GitHub context.

## Architecture

```
Cron Job (every 10 min)
  ↓
Check for trigger file
  ↓
If trigger found:
  → Send wake event
  → Spawn isolated agent
  → Agent reads GitHub repos
  → Agent crafts response
  → Agent posts to Farcaster
```

## Components

### 1. Cron Job
**Name:** `farcaster-mentions-check`  
**Schedule:** Every 10 minutes  
**Action:** Runs `scripts/check-farcaster-mentions.sh`

```bash
openclaw cron list  # View status
openclaw cron run farcaster-mentions-check  # Manual trigger
```

### 2. Checker Script
**Path:** `/home/donut-agent/.openclaw/workspace/scripts/check-farcaster-mentions.sh`

Checks for trigger file at:
`/home/donut-agent/.openclaw/workspace/memory/farcaster-trigger.json`

If found:
1. Reads mention data
2. Sends wake event to Gateway
3. Spawns isolated agent
4. Removes trigger file

### 3. Isolated Agent
**Session:** Isolated (separate from main builder agent)  
**Context:** 
- GitHub repos (donutdao-app-template, donutdao-agents)
- Mention data from trigger
- Farcaster posting capabilities

**Responsibilities:**
- Assess if mention needs response
- Craft helpful, concise reply (≤280 chars)
- Post via Farcaster helper scripts

## Usage

### Manual Trigger (Current Mode)

When you see a mention that needs response:

```bash
# Create trigger file
cat > /home/donut-agent/.openclaw/workspace/memory/farcaster-trigger.json << 'EOF'
[
  {
    "author": "username",
    "authorFid": 123456,
    "text": "Hey @crulleragent, how do I use DonutDAO?",
    "hash": "0xabcd1234...",
    "parentHash": null
  }
]
EOF
```

Within 10 minutes, the cron will:
1. Detect the trigger file
2. Spawn isolated agent
3. Agent responds to the mention

### View Agent Activity

```bash
# List sessions
openclaw sessions list

# View isolated session history
openclaw sessions history <session-key>
```

## Response Guidelines

The isolated agent follows these rules:

**When to Respond:**
- ✅ Questions about DonutDAO (governance, mining, launches)
- ✅ Technical questions about contracts/integration
- ✅ Feedback or suggestions
- ✅ Collaboration requests

**When to Skip:**
- ❌ Spam
- ❌ Off-topic
- ❌ Unclear/vague
- ❌ Already answered

**Response Style:**
- Concise (≤280 chars)
- Helpful, not corporate
- Reference specific features/docs
- Agent-appropriate tone
- Include relevant links (GitHub, docs)

## Future Enhancements

### Phase 2: Hub Protocol Polling

Replace manual trigger with actual hub queries:

```javascript
// Query hub for casts mentioning our FID
const client = getSSLHubRpcClient('nemes.farcaster.xyz:2283');
// Filter for mentions since last check
// Automatically create trigger file
```

**Challenges:**
- Hub protocol doesn't have direct "mentions" API
- Would need to poll recent casts and filter
- Higher complexity, more API calls

### Phase 3: Event Streaming

Real-time mention detection:

```javascript
// Subscribe to hub events
client.subscribe({
  eventTypes: ['CAST_ADD'],
  fromFid: null // All casts
});

// Filter for mentions in real-time
// Instant response (no 10min delay)
```

**Challenges:**
- Requires persistent listener process
- More complex infrastructure
- But true real-time responses

## Configuration

### Adjust Check Frequency

```bash
# Stop current job
openclaw cron remove farcaster-mentions-check

# Create with new frequency
openclaw cron add \
  --name "farcaster-mentions-check" \
  --every "5m" \
  --session "main" \
  --system-event "exec: /home/donut-agent/.openclaw/workspace/scripts/check-farcaster-mentions.sh"
```

### Disable/Enable

```bash
# Disable
openclaw cron update farcaster-mentions-check --disabled

# Enable
openclaw cron update farcaster-mentions-check --enabled
```

## Monitoring

### Check Last Run

```bash
openclaw cron list
# Shows: last run time, status, next run
```

### View Logs

```bash
# View cron execution logs
openclaw cron runs farcaster-mentions-check

# View isolated agent sessions
openclaw sessions list --kinds isolated
```

### Last Check State

```bash
cat /home/donut-agent/.openclaw/workspace/memory/farcaster-last-check.json
# Shows: last check timestamp, last processed hash
```

## Troubleshooting

### Cron Not Running

```bash
# Check status
openclaw cron list

# Manually trigger
openclaw cron run farcaster-mentions-check

# Check Gateway connection
openclaw status
```

### Agent Not Responding

```bash
# Check if wake event was sent (logs)
# Check isolated sessions
openclaw sessions list

# View session history
openclaw sessions history <key>
```

### Farcaster Posting Fails

```bash
# Test posting manually
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo
./scripts/farcaster-post.sh profile "Test post"

# Check credentials
pass donut-agent/farcaster/signer-private-key
pass donut-agent/farcaster/fid
```

## Security

- ✅ Isolated agent (separate from main context)
- ✅ Read-only GitHub access
- ✅ Can only post to Farcaster (not modify repos)
- ✅ Manual trigger mode (human in the loop)

## Changelog

### v1.0.0 (2026-02-04)
- Initial implementation
- Manual trigger mode
- 10 minute polling
- Isolated agent spawning
- GitHub context integration

---

**Maintained by:** Cruller (@cruller_donut)  
**Questions?** Check OpenClaw docs or ask in session
