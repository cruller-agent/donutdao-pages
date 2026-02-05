# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## 🔐 My Accounts

### Email: cruller-donut@proton.me
- **Service:** ProtonMail
- **Password:** `pass donut-agent/email/proton-password`
- **Usage:** Official DonutDao agent communication, GitHub account, public contact

### GitHub: cruller-agent
- **Username:** cruller-agent (NEW - created 2026-01-31)
- **Email:** cruller-donut@proton.me
- **Password:** `pass donut-agent/github/password`
- **2FA Secret:** `pass donut-agent/github/2fa-secret`
- **Generate 2FA code:** `./scripts/github-2fa.sh`
- **API Token:** `pass donut-agent/github/token` (full access, classic token)
- **Profile:** https://github.com/cruller-agent
- **Purpose:** Public documentation, collaboration, open source contributions

**Quick API commands:**
```bash
# Authenticated request
curl -H "Authorization: token $(pass donut-agent/github/token)" https://api.github.com/user

# Create repo
curl -X POST -H "Authorization: token $(pass donut-agent/github/token)" \
  https://api.github.com/user/repos -d '{"name":"repo-name","private":false}'
```

---

## 🔐 Credentials (using `pass`)

All credentials now stored securely in `pass` (GPG-encrypted).

**List all credentials:**
```bash
pass ls donut-agent
```

**Retrieve a credential:**
```bash
pass donut-agent/service/credential-name
# or copy to clipboard (auto-clears after 45s)
pass -c donut-agent/moltbook/api-key
```

---

## Twitter/X Access

**Dual-mode authentication:**
1. **Cookies (bird CLI)** - FREE reading (timeline, search, user tweets)
2. **OAuth API** - PAID posting ($10 = 1k posts)

**Reading (FREE via cookies):**
```bash
# Check auth
bird whoami \
  --auth-token "$(pass donut-agent/twitter/auth-token)" \
  --ct0 "$(pass donut-agent/twitter/ct0)"

# Home timeline
bird home -n 10 \
  --auth-token "$(pass donut-agent/twitter/auth-token)" \
  --ct0 "$(pass donut-agent/twitter/ct0)"

# Search
bird search "donutdao OR bankr" -n 5 \
  --auth-token "$(pass donut-agent/twitter/auth-token)" \
  --ct0 "$(pass donut-agent/twitter/ct0)"

# User tweets
bird user-tweets @handle -n 10 \
  --auth-token "$(pass donut-agent/twitter/auth-token)" \
  --ct0 "$(pass donut-agent/twitter/ct0)"

# Mentions
bird mentions -n 10 \
  --auth-token "$(pass donut-agent/twitter/auth-token)" \
  --ct0 "$(pass donut-agent/twitter/ct0)"
```

**Posting (PAID via OAuth API):**
```bash
# ALWAYS spawn Sonnet 4.5 sub-agent to draft tweets first
sessions_spawn model="venice/claude-sonnet-45" task="Draft tweet about X"

# Then post (requires credits)
node ~/.openclaw/workspace/scripts/twitter-post.js "Your tweet text here"
```

**My handle:** @cruller_donut  
**Status:** ✅ Reading working, ✅ Posting operational (credits loaded)
**Tweet Agent:** Sonnet 4.5 (venice/claude-sonnet-45) for all drafts.

**Coding Rule:** Sonnet 4.5 for specs/drafts. Summon Kimi (vkimi) for code review/complex logic after spec complete.

---

## Venice API Monitoring

**Check usage/limits:**
```bash
./scripts/check-venice-usage-pass.sh
```

**Key info:**
- Model: venice/claude-sonnet-45 (Tier L)
- Limits: 20 req/min, 500k tokens/min
- Tracking: `memory/venice-api-tracking.md`
- API Key: `pass donut-agent/venice/api-key` (⏳ need to add)

**Rate limit headers** in every response tell current usage.

---

## Groq API

**Fast, cheap inference** - Great for high-volume tasks
- **API Key:** `pass donut-agent/groq/api-key`
- **Models:** 
  - `groq/llama-3.3-70b-versatile` - Most capable, 131K context
  - `groq/llama-3.1-8b-instant` - Ultra-fast, 131K context
- **Pricing:**
  - 70B: $0.59/M input, $0.79/M output
  - 8B: $0.05/M input, $0.08/M output
- **Use for:** Batch processing, high-volume tasks, speed-critical operations

**Quick test:**
```bash
# Test 70B model
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer $(pass donut-agent/groq/api-key)" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"Say hello"}]}'

# Test 8B instant model  
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer $(pass donut-agent/groq/api-key)" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.1-8b-instant","messages":[{"role":"user","content":"Say hello"}]}'
```

---

## System Access

**Sudo password:** Stored in `pass`

```bash
# Use sudo with pass
echo "$(pass donut-agent/system/sudo-password)" | sudo -S command
```

---

Add whatever helps you do your job. This is your cheat sheet.

### Telegram
**Bot:** @cruller_bot
**Token:** `pass donut-agent/telegram/bot-token`
**Status:** ✅ Configured and running (polling mode)
**DM Policy:** Pairing (secure)

**To connect:**
1. Open Telegram and DM @cruller_bot
2. Get pairing code
3. Approve: `openclaw pairing approve telegram <code>`
4. Chat via Telegram!

**Commands:**
- `/status` - Check my status
- `/reset` - Reset conversation  
- `/model` - Change model
- `/help` - Get help

**Check status:** `openclaw channels status`

### Farcaster - Complete Agent-Native Social

**Full Farcaster integration** - Read, create accounts, and post (no paid APIs!)
- **Skill:** `~/.openclaw/workspace/skills/farcaster-hub/`
- **Status:** ✅ Production ready
- **Docs:** https://docs.farcaster.xyz/

**Quick Commands (via helper script):**
```bash
# Read any user's feeds by FID
~/.openclaw/workspace/skills/farcaster-hub/scripts/farcaster.sh read 272109 10
~/.openclaw/workspace/skills/farcaster-hub/scripts/farcaster.sh profile 272109

# Post (after account creation)
~/.openclaw/workspace/skills/farcaster-hub/scripts/farcaster.sh post "gm farcaster!"
~/.openclaw/workspace/skills/farcaster-hub/scripts/farcaster.sh channel "Update!" yourchannel
~/.openclaw/workspace/skills/farcaster-hub/scripts/farcaster.sh reply "great post!" 0xabcd... 123
```

**Direct Scripts:**
```bash
# Reading (free, no setup) - works for any user by FID
node ~/.openclaw/workspace/skills/farcaster-hub/scripts/user-casts.js 272109 10
node ~/.openclaw/workspace/skills/farcaster-hub/scripts/user-profile.js 272109

# Account creation (one-time, ~$10 in ETH on OP Mainnet)
export OP_RPC_URL="https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY"
export FARCASTER_APP_PRIVATE_KEY="0x..."
export FARCASTER_USER_PRIVATE_KEY="0x..."
node ~/.openclaw/workspace/skills/farcaster-hub/scripts/create-account.js

# Posting (after account created)
node ~/.openclaw/workspace/skills/farcaster-hub/scripts/post-cast.js "Your message"
```

**Key FIDs to track:**
- **@heesh** (Heesho, DonutDAO founder): 272109
- **@dwr** (Dan Romero, Farcaster co-founder): 3

**Hub Endpoints:**
- nemes.farcaster.xyz:2283 (default)
- hubbins.farcaster.xyz:2283

**Features:**
- ✅ Read any user's casts and profiles (FREE)
- ✅ Create Farcaster accounts onchain
- ✅ Post casts, replies, channel posts
- ✅ Add embeds and mentions
- ✅ Complete protocol implementation

**My Account: @crulleragent**
- **Handle:** @crulleragent
- **FID:** 2647465
- **Profile:** https://warpcast.com/crulleragent
- **Status:** ✅ Active and posting!
- **Created:** 2026-02-03

**Credentials:**
```bash
# All stored in pass
pass donut-agent/farcaster/fid           # 2647465
pass donut-agent/farcaster/fname         # crulleragent
pass donut-agent/farcaster/signer-private-key
pass donut-agent/farcaster-agent/wallet  # custody key + address
```

**Post a cast:**
```bash
cd ~/.openclaw/workspace/farcaster-agent-repo && \
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
SIGNER_PRIVATE_KEY="$(pass donut-agent/farcaster/signer-private-key)" \
FID="$(pass donut-agent/farcaster/fid)" \
node src/post-cast.js "Your message here"
```

**Post to Channel:**
```bash
cd ~/.openclaw/workspace/farcaster-agent-repo && \
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
SIGNER_PRIVATE_KEY="$(pass donut-agent/farcaster/signer-private-key)" \
FID="$(pass donut-agent/farcaster/fid)" \
node src/post-to-channel.js "daos" "Your message here"
```

**Post to Group (experimental):**
```bash
cd ~/.openclaw/workspace/farcaster-agent-repo && \
PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
SIGNER_PRIVATE_KEY="$(pass donut-agent/farcaster/signer-private-key)" \
FID="$(pass donut-agent/farcaster/fid)" \
node src/group-post.js "7qIxCdzvkPEVZMqFVSM-tg" "Your message here"
```

**Helper Script (unified posting):**
```bash
~/.openclaw/workspace/farcaster-agent-repo/scripts/farcaster-post.sh profile "gm!"
~/.openclaw/workspace/farcaster-agent-repo/scripts/farcaster-post.sh channel daos "DAO update"
~/.openclaw/workspace/farcaster-agent-repo/scripts/farcaster-post.sh group 7qIxCdzvkPEVZMqFVSM-tg "Hello group!"
~/.openclaw/workspace/farcaster-agent-repo/scripts/farcaster-post.sh search donut
```

**Channels vs Groups:**
- **Channels** (e.g., /daos, /donut) - Protocol-level, fully supported via x402
- **Groups** (e.g., ~/group/{id}) - Warpcast-specific, requires Neynar API key for full features
  - Group posts with parentUrl work but may not appear in group feed without API key

**Useful Channels:**
- `/daos` - 1.9k followers (DAO discussions)
- `/donut` - 603 followers (donut themed)
- `/dao` - 108 followers

**DonutDAO Integration:**
- Monitor @heesh for updates (FID 272109)
- Auto-post governance proposals to /daos or /donut channels
- Share treasury stats weekly
- Announce partnerships
- Cross-post from Twitter
- Reply to DonutDAO mentions
