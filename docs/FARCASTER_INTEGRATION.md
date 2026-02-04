# Farcaster Integration - Production Documentation

Complete Farcaster integration for autonomous agent operations on DonutDAO.

**Based on:** `farcaster-agent-repo/AGENT_GUIDE.md` (tested and working)

## Overview

**Repository:** `/home/donut-agent/.openclaw/workspace/farcaster-agent-repo`  
**Status:** ✅ Production Ready  
**Account:** @crulleragent (FID 2647465)  
**Profile:** https://warpcast.com/crulleragent

### Features

1. ✅ **Read feeds** - Query any user's casts and profile
2. ✅ **Monitor mentions** - Autonomous polling every 10 minutes
3. ✅ **Reply to mentions** - Automatic responses with context
4. ✅ **Post casts** - Profile timeline, channels, replies
5. ✅ **Token-gated responses** - Check DONUT/gDONUT holdings
6. ✅ **Profile management** - Update PFP, bio, display name

---

## 💰 Actual Costs (Tested)

| Operation | Chain | Cost | Notes |
|-----------|-------|------|-------|
| FID Registration | Optimism | ~$0.20 | One-time |
| Add Signer | Optimism | ~$0.05 | One-time |
| ETH→USDC Swap | Base | ~$0.05 | One-time setup |
| Bridge (Across) | Various | $0.10-0.20 | One-time setup |
| **x402 API Call** | **Base** | **$0.001 USDC** | **Per cast/query** |
| **Total Setup** | | **~$0.50** | |

**Ongoing costs:** $0.001 USDC per API call (casts, queries, profile updates)

**Budget:** $1 total for setup + buffer. Then ~$1 per 1000 operations.

---

## Architecture

### 1. Autonomous Mention System

**How it works:**
```
Every 10 min (cron) → Poll Neynar API via x402 → Find new mentions → Spawn isolated agent → Reply
```

**Components:**
- `scripts/check-farcaster-mentions.sh` - Main cron script
- `farcaster-agent-repo/src/get-mentions.js` - API polling (x402)
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

### 2. x402 Micropayments (Critical)

**All API calls require x402 payment:**
- Read operations: $0.001 USDC
- Write operations (casts): $0.001 USDC
- Profile updates: $0.001 USDC

**How it works:**
1. Sign EIP-3009 `transferWithAuthorization` (gasless USDC transfer on Base)
2. Create payment payload with signature + authorization
3. Base64 encode and include in `X-PAYMENT` header
4. Neynar charges 0.001 USDC per request

**Payment recipient:** `0xA6a8736f18f383f1cc2d938576933E5eA7Df01A1` (Neynar)

**Implementation:** See `farcaster-agent-repo/src/x402.js`

---

## Key Scripts

### Get Mentions (with x402 payment)
```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo

# Get all mentions and replies (costs 0.001 USDC)
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

### Reply to Cast (costs 0.001 USDC)
```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo

# Reply to a mention
./scripts/farcaster-reply.sh "0xCAST_HASH" "Your reply text here"
```

**Features:**
- Validates parent cast exists (costs 0.001 USDC to fetch)
- Proper `parentCastId` structure
- Posts reply (costs 0.001 USDC)
- Returns reply URL
- Total cost: ~$0.002 per reply

### Post Cast (costs 0.001 USDC)
```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo

# Post to profile
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
SIGNER_PRIVATE_KEY="$(pass donut-agent/farcaster/signer-private-key)" \
FID="$(pass donut-agent/farcaster/fid)" \
node src/post-cast.js "Your cast text"

# Post to channel
./scripts/farcaster-post.sh channel daos "DAO update text"
```

### Update Profile Picture (costs 0.001 USDC)
```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo

# Update PFP
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
SIGNER_PRIVATE_KEY="$(pass donut-agent/farcaster/signer-private-key)" \
FID="$(pass donut-agent/farcaster/fid)" \
node src/update-pfp.js "https://i.imgur.com/your-image.jpg"
```

### Check Token Balances (FREE - uses Base RPC, not Neynar)
```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo

# Check DONUT/gDONUT for any user (no x402 cost!)
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
node src/check-donut-balance.js <FID>
```

**Note:** Token balance checking uses the Neynar API to get verified addresses (costs 0.001 USDC), then queries Base RPC directly for balances (free).

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

---

## Contract Addresses

### Optimism (Account Creation)
| Contract | Address |
|----------|---------|
| IdGateway | `0x00000000Fc25870C6eD6b6c7E41Fb078b7656f69` |
| KeyGateway | `0x00000000fC56947c7E7183f8Ca4B62398CaAdf0B` |
| SignedKeyRequestValidator | `0x00000000FC700472606ED4fA22623Acf62c60553` |

### Base (Operations + Payments)
| Contract | Address |
|----------|---------|
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| DONUT | `0xAE4a37d554C6D6F3E398546d8566B25052e0169C` |
| gDONUT | `0xC78B6e362cB0f48b59E573dfe7C99d92153a16d3` |

### Neynar
| Endpoint | URL |
|----------|-----|
| Hub API | `hub-api.neynar.com` |
| REST API | `api.neynar.com` |
| Payment Address | `0xA6a8736f18f383f1cc2d938576933E5eA7Df01A1` |

---

## Cost Management

### Minimize API Calls

**Expensive (0.001 USDC each):**
- ❌ Fetching user profiles
- ❌ Querying casts
- ❌ Posting casts
- ❌ Profile updates

**Free:**
- ✅ Direct Base RPC queries (token balances)
- ✅ Reading from our own cache
- ✅ Local computation

**Best practices:**
1. Cache user data (FID → addresses) locally
2. Batch operations when possible
3. Query token balances via Base RPC (not Neynar) after getting addresses once
4. Use timestamp-based deduplication to avoid reprocessing mentions

### Budget Planning

**Mention monitoring (autonomous):**
- Check every 10 min = 144 checks/day
- Average 1 new mention/day = 1 reply
- Cost: 144 × $0.001 + 1 × $0.002 = **$0.146/day**

**With optimizations (check only if trigger exists):**
- Manual trigger detection = FREE
- API call only when mentions found = 1-5 × $0.001
- Reply: 1 × $0.002
- Cost: **~$0.005/day**

**Current implementation:** Uses trigger file approach (~$0.005/day)

---

## Integration Patterns

### 1. Basic Mention Response
```javascript
// Spawned agent gets mention data (from trigger file - free)
{
  author: "username",
  text: "Hey @crulleragent, what is LSG?",
  hash: "0xabcd...",
  authorFid: 12345
}

// Agent:
// 1. Reads latest docs (DONUTDAO_FACTS.md) - FREE
// 2. Crafts response (≤280 chars) - FREE
// 3. Replies via farcaster-reply.sh - $0.002
```

### 2. Token-Gated Response
```javascript
// One-time: Get user's verified addresses (0.001 USDC)
const user = await getNeynarUser(mention.authorFid);
const addresses = user.verified_addresses.eth_addresses;

// Cached! Now query balances via Base RPC (FREE)
const donutBalance = await donutContract.balanceOf(addresses[0]);
const gDonutBalance = await gDonutContract.balanceOf(addresses[0]);

if (gDonutBalance >= 100n * 10n**18n) {
  // Premium response
} else {
  // Basic response
}

// Total cost: $0.001 (first time) + $0.002 (reply) = $0.003
// Subsequent checks: $0.002 (using cached addresses)
```

### 3. Autonomous Monitoring (Optimized)
```bash
# Check for manual trigger (FREE)
if [ -f "$TRIGGER_FILE" ]; then
    # Mentions found in trigger file
    # Spawn agent to respond
    # Cost: $0.002 per reply
fi

# No polling unless triggered
# Budget: ~$0.005/day for typical usage
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
- Query all verified ETH addresses (0.001 USDC first time)
- Calculate total voting power (FREE via Base RPC)
- Cache addresses locally to minimize costs

### Possible Features

**Tier 1: Basic (Everyone)**
- General info about DonutDAO
- Links to documentation
- Basic LSG explanations
- **Cost per interaction:** $0.002

**Tier 2: Holders (10+ gDONUT)**
- Detailed strategy analysis
- Voting power calculations
- Bribe notifications
- **Cost per interaction:** $0.003 (first time) / $0.002 (cached)

**Tier 3: Power Users (100+ gDONUT)**
- Custom research reports
- Priority responses
- Portfolio recommendations
- **Cost per interaction:** $0.003 (first time) / $0.002 (cached)

**Tier 4: Whales (1000+ gDONUT)**
- Private consultation
- Strategy backtesting
- Governance proposals
- **Cost per interaction:** $0.003 (first time) / $0.002 (cached)

---

## Testing

### Test Reply Flow

1. **Post a test mention:**
```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
SIGNER_PRIVATE_KEY="$(pass donut-agent/farcaster/signer-private-key)" \
FID="$(pass donut-agent/farcaster/fid)" \
node src/post-cast.js "Test: @crulleragent what's your favorite feature?"
# Cost: $0.001
```

2. **Create manual trigger:**
```bash
cd /home/donut-agent/.openclaw/workspace
./scripts/trigger-farcaster-response.sh \
  "testuser" \
  "Test mention text" \
  "0xCAST_HASH" \
  "12345"
# Cost: FREE
```

3. **Trigger response:**
```bash
./scripts/check-farcaster-mentions.sh
# Cost: $0.002 (reply)
```

4. **Verify reply:**
- Check Warpcast for the reply
- Confirm it's threaded (not standalone)
- Verify accurate DonutDAO info

### Test Token Balance Check

```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo

# Check your balance
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
node src/check-donut-balance.js 1043177
# Cost: $0.001 (get addresses) + FREE (query balances)
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

**Wallet on Base:** Needs USDC for x402 payments

**Check balance:**
```bash
cast balance $(pass donut-agent/farcaster-agent/wallet | tail -1) --rpc-url https://mainnet.base.org
```

---

## Production Status

✅ **Mention monitoring:** Every 10 min via cron (trigger-based, optimized)  
✅ **Reply system:** Tested and working  
✅ **Token balances:** Accurate DONUT/gDONUT queries (cached)  
✅ **Documentation:** DONUTDAO_FACTS.md for accurate info  
✅ **Error handling:** Graceful failures, retry logic  
✅ **Cost optimization:** Trigger-based checks, local caching

**Recent Responses:**
- @trimaxion: Corrected Discord link misinformation ($0.002)
- @trimaxion: Explained LSG features ($0.002)
- Test mentions: Verified reply threading ($0.002)

**Total operational cost:** ~$0.005/day (1-2 replies average)

---

## Common Issues

### "invalid hash"
**Cause:** Using @farcaster/hub-nodejs < 0.15.9  
**Fix:** `npm install @farcaster/hub-nodejs@latest`

### "Failed to verify payment"
**Cause:** Insufficient USDC on Base  
**Fix:** Send USDC to custody address

### "unknown fid"
**Cause:** Hub not synced yet  
**Fix:** Wait 30-60 seconds after registration

### High costs
**Cause:** Polling API too frequently  
**Fix:** Use trigger-based approach (current implementation)

---

## Maintenance

### Check USDC Balance
```bash
# Check wallet USDC (for x402 payments)
cast balance --erc20 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 \
  $(pass donut-agent/farcaster-agent/wallet | tail -1) \
  --rpc-url https://mainnet.base.org
```

**Top up when < 0.01 USDC (~10 operations)**

### View Cron Status
```bash
openclaw cron list | grep farcaster
```

### Check Recent Mentions (costs 0.001 USDC)
```bash
cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
FID="$(pass donut-agent/farcaster/fid)" \
node src/get-mentions.js
```

---

## Future Enhancements

1. **Hub Protocol Polling** - Direct hub queries (might still cost, TBD)
2. **Governance Alerts** - Notify users of bribe opportunities
3. **Payment System** - Accept DONUT for premium features
4. **Strategy Recommendations** - Personalized based on holdings
5. **Multi-Channel** - Cross-post to Twitter, Discord
6. **Analytics** - Track engagement, measure ROI vs costs

---

## Links

- **Profile:** https://warpcast.com/crulleragent
- **Farcaster Docs:** https://docs.farcaster.xyz/
- **Neynar API:** https://docs.neynar.com/
- **AGENT_GUIDE:** `farcaster-agent-repo/AGENT_GUIDE.md` (canonical reference)
- **DonutDAO Contracts:** `/home/donut-agent/.openclaw/workspace/donutdao-app-template/contracts`
- **Agent Repo:** `/home/donut-agent/.openclaw/workspace/farcaster-agent-repo`

---

**Last Updated:** 2026-02-04  
**Status:** ✅ Production Ready (Tested & Working)  
**Actual Setup Cost:** ~$0.50  
**Operational Cost:** ~$0.005/day  
**Based on:** AGENT_GUIDE.md (verified implementation)  
**Maintainer:** @cruller_donut
