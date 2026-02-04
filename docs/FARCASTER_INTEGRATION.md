# Farcaster Integration - Complete Documentation

Complete Farcaster integration for autonomous agent operations on DonutDAO.

## Overview

**Repository:** `/home/donut-agent/.openclaw/workspace/farcaster-agent-repo`  
**Status:** ✅ Production Ready  
**Account:** @crulleragent (FID 2647465)

### Features

1. ✅ **Read feeds** - Query any user's casts and profile
2. ✅ **Create accounts** - Onchain registration ($10 ETH on OP Mainnet)
3. ✅ **Post casts** - Profile timeline, channels, replies
4. ✅ **Monitor mentions** - Autonomous polling every 10 minutes
5. ✅ **Reply to mentions** - Automatic responses with context
6. ✅ **Token-gated responses** - Check DONUT/gDONUT holdings
7. ✅ **Delete casts** - Remove posts when needed

---

## Architecture

### 1. Autonomous Mention System

**How it works:**
```
Every 10 min (cron) → Poll Neynar API → Find new mentions → Spawn isolated agent → Reply
```

**Components:**
- `scripts/check-farcaster-mentions.sh` - Main cron script
- `farcaster-agent-repo/src/get-mentions.js` - API polling
- `farcaster-agent-repo/src/reply-to-cast.js` - Reply mechanism
- `memory/farcaster-last-check.json` - State tracking

**Cron Job:**
```bash
# Runs every 10 minutes
openclaw cron list | grep farcaster
```

**Manual trigger:**
```bash
cd /home/donut-agent/.openclaw/workspace
./scripts/check-farcaster-mentions.sh
```

---

## Key Scripts

### Get Mentions
```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo

# Get all mentions and replies
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
FID="$(pass donut-agent/farcaster/fid)" \
node src/get-mentions.js
```

**Output:**
```json
[
  {
    "author": "username",
    "authorFid": 12345,
    "text": "Hey @crulleragent...",
    "hash": "0xabcd...",
    "parentHash": "0x1234...",
    "timestamp": 1770202750,
    "type": "reply",
    "url": "https://warpcast.com/username/0xabcd..."
  }
]
```

### Reply to Cast
```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo

# Reply to a mention
./scripts/farcaster-reply.sh "0xCAST_HASH" "Your reply text here"
```

**Features:**
- Validates parent cast exists
- Proper `parentCastId` structure
- Returns reply URL
- Verifies on network

### Check Token Balances
```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo

# Check DONUT/gDONUT for any user
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
node src/check-donut-balance.js <FID>
```

**Output:**
```
User: @username (FID 12345)
Verified addresses: 3

=== Token Balances ===
0xABCD...1234:
  DONUT:  100.50
  gDONUT: 500.75

=== TOTALS ===
DONUT:  100.50
gDONUT: 500.75
Voting Power: 500.75
```

**Use cases:**
- Token-gated responses
- Governance alerts
- Personalized replies
- Premium features

---

## Integration Patterns

### 1. Basic Mention Response
```javascript
// Spawned agent gets mention data
{
  author: "username",
  text: "Hey @crulleragent, what is LSG?",
  hash: "0xabcd...",
  authorFid: 12345
}

// Agent:
// 1. Reads latest docs (DONUTDAO_FACTS.md)
// 2. Crafts response (≤280 chars)
// 3. Replies via farcaster-reply.sh
```

### 2. Token-Gated Response
```javascript
// Before responding:
const balances = await checkDonutBalance(mention.authorFid);

if (balances.gDonut >= 100) {
  // Premium response with detailed analysis
} else {
  // Basic response with public info
}
```

### 3. Governance Alert
```javascript
// Monitor for new bribes
const balances = await checkDonutBalance(userFid);
if (balances.gDonut > 0) {
  // Notify about new bribe opportunities
  reply(`Hey @${username}, new bribes available! Your ${balances.gDonut} gDONUT can earn...`);
}
```

---

## Response Guidelines

### Agent Instructions (from check-farcaster-mentions.sh)

**Read context:**
- `/home/donut-agent/.openclaw/workspace/DONUTDAO_FACTS.md` (CRITICAL)
- `/home/donut-agent/.openclaw/workspace/donutdao-app-template`
- `/home/donut-agent/.openclaw/workspace/donutdao-agents`

**Assess mentions:**
- ✅ Questions, feedback, collaboration requests
- ❌ Skip: spam, unclear, off-topic

**Craft responses:**
- Helpful and concise (≤280 chars)
- Reference specific features/docs if relevant
- Agent-appropriate tone (competent, friendly, not corporate)
- Use corrected DonutDAO info (Glaze Corp = primary builder, permissionless contracts)

**Post replies:**
```bash
./scripts/farcaster-reply.sh "<hash>" "Response text"
```

---

## Token-Gated Features

### Current Implementation
- Check DONUT/gDONUT balances for any Farcaster user
- Query all verified ETH addresses
- Calculate total voting power

### Possible Features

**Tier 1: Basic (Everyone)**
- General info about DonutDAO
- Links to documentation
- Basic LSG explanations

**Tier 2: Holders (10+ gDONUT)**
- Detailed strategy analysis
- Voting power calculations
- Bribe notifications

**Tier 3: Power Users (100+ gDONUT)**
- Custom research reports
- Priority responses
- Portfolio recommendations

**Tier 4: Whales (1000+ gDONUT)**
- Private consultation
- Strategy backtesting
- Governance proposals

---

## Testing

### Test End-to-End Flow

1. **Post a test mention:**
```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo
./scripts/farcaster-post.sh profile "Test: @crulleragent what's your favorite feature?"
```

2. **Trigger mention check:**
```bash
cd /home/donut-agent/.openclaw/workspace
./scripts/check-farcaster-mentions.sh
```

3. **Verify reply:**
- Check Warpcast for the reply
- Confirm it's threaded (not standalone)
- Verify accurate DonutDAO info

### Test Token Balance Check

```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo

# Check your balance
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
node src/check-donut-balance.js 1043177
```

---

## Credentials

All stored in `pass`:

```bash
# Farcaster account
pass donut-agent/farcaster/fid                    # 2647465
pass donut-agent/farcaster/fname                  # crulleragent
pass donut-agent/farcaster/signer-private-key     # Ed25519 signer
pass donut-agent/farcaster-agent/wallet           # Custody key + address

# Contract addresses
DONUT:  0xAE4a37d554C6D6F3E398546d8566B25052e0169C
gDONUT: 0xC78B6e362cB0f48b59E573dfe7C99d92153a16d3
```

---

## Production Status

✅ **Mention monitoring:** Every 10 min via cron  
✅ **Reply system:** Tested and working  
✅ **Token balances:** Accurate DONUT/gDONUT queries  
✅ **Documentation:** DONUTDAO_FACTS.md for accurate info  
✅ **Error handling:** Graceful failures, retry logic  

**Recent Responses:**
- @trimaxion: Corrected Discord link misinformation
- @trimaxion: Explained LSG features
- Test mentions: Verified reply threading

---

## Maintenance

### Update Last Check Time
```bash
echo '{"lastCheck": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' > \
  /home/donut-agent/.openclaw/workspace/memory/farcaster-last-check.json
```

### View Cron Status
```bash
openclaw cron list | grep farcaster
```

### Check Recent Mentions
```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
FID="$(pass donut-agent/farcaster/fid)" \
node src/get-mentions.js
```

---

## Future Enhancements

1. **Hub Protocol Polling** - Direct hub queries (no x402 cost)
2. **Governance Alerts** - Notify users of bribe opportunities
3. **Payment System** - Accept DONUT for premium features
4. **Strategy Recommendations** - Personalized based on holdings
5. **Multi-Channel** - Cross-post to Twitter, Discord
6. **Analytics** - Track engagement, measure impact

---

## Links

- **Profile:** https://warpcast.com/crulleragent
- **Farcaster Docs:** https://docs.farcaster.xyz/
- **Neynar API:** https://docs.neynar.com/
- **DonutDAO Contracts:** `/home/donut-agent/.openclaw/workspace/donutdao-app-template/contracts`
- **Agent Repo:** `/home/donut-agent/.openclaw/workspace/farcaster-agent-repo`

---

**Last Updated:** 2026-02-04  
**Status:** ✅ Production Ready  
**Maintainer:** @cruller_donut
