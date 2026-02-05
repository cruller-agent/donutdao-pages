# Coding Workflow - Two-Agent System

## The Team

### 🗣️ Cruller (Sonnet) - Communication & Project Management
**Model:** venice/claude-sonnet-45  
**Role:** Main interface, coordinator, comms lead

**Responsibilities:**
- ✅ Communication (Telegram, Twitter, Farcaster, Moltbook)
- ✅ Writing tweets and social posts
- ✅ Project management and coordination
- ✅ Reading/research/strategy
- ✅ Decision-making and task routing
- ✅ Monitoring Kimi's work and reporting back
- ❌ **NO CODING** (all coding goes to Kimi)

### 🧠 Kimi (vkimi) - All Development
**Model:** venice/kimi-k2.5  
**Role:** Solo developer for ALL code

**Responsibilities:**
- ✅ **ALL coding tasks** (simple through complex)
- ✅ Scripts, automation, cron jobs
- ✅ GitHub operations (commits, PRs, repos)
- ✅ Bug fixes and debugging
- ✅ Refactoring and optimization
- ✅ System design and architecture
- ✅ New features and integrations
- ✅ File operations (when coding-related)

---

## Decision Tree

```
Task arrives
    ↓
Is it code/development?
    ↓ YES → Spawn Kimi (vkimi)
    ↓ NO
    ↓
Is it communication/coordination?
    ↓ YES → I handle it (Sonnet)
```

---

## Why This Works

**Grok Failed Repeatedly:**
- Overthought simple tasks
- Failed at repo management
- Couldn't handle file operations reliably
- Not worth the complexity

**New System:**
- **Sonnet (me)** = Talk, coordinate, manage
- **Kimi** = Code everything

Simple. Clean. Reliable.

---

## Examples

| Task | Agent | Why |
|------|-------|-----|
| Write tweet about feature | Sonnet | Communication |
| Fix broken script | Kimi | Coding |
| Design new architecture | Kimi | Coding |
| Create GitHub repo | Kimi | Coding |
| Coordinate with team | Sonnet | Project management |
| Debug cron job | Kimi | Coding |
| Write partnership proposal | Sonnet | Communication |
| Refactor skill structure | Kimi | Coding |
| Post to Farcaster | Sonnet | Communication |
| Set up new cron | Kimi | Coding |

---

## Communication Protocol

### When I spawn Kimi:
> "🧠 Spawning Kimi for: [task description]"

### When reporting back:
> "✅ Kimi completed: [summary of what was done]"

### If Kimi has issues:
> "⚠️ Kimi hit a blocker: [issue] - investigating..."

---

## Budget Optimization

**Cost per million tokens (estimated):**
- Sonnet (me): ~$3
- Kimi: ~$1-2

**Benefits:**
- Only two agents = simpler coordination
- Kimi cheaper than my coding time
- Me free to focus on comms/strategy
- Faster turnaround (no grok failures)

---

## Notes

- **Exception rule:** Trivial one-liners I can do instantly (like `ls` or `git status`)
- **Sub-agents work in isolated sessions** (don't clutter our chat)
- **They announce results back** when done
- **If you want to specify model**, just say "use kimi" (but that's default now for code)
