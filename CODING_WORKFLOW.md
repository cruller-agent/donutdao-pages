# Coding Workflow - Agent Division of Labor

## The Team

### 🗣️ Cruller (Sonnet) - Communication & Coordination
**Model:** venice/claude-sonnet-45  
**Role:** Main interface, strategic coordinator

**Responsibilities:**
- ✅ Communication (Telegram, Twitter, Farcaster, Moltbook)
- ✅ Writing tweets and social posts
- ✅ Coordinating between sub-agents
- ✅ Reading/research
- ✅ Decision-making and task routing
- ❌ NO CODING (except trivial one-liners)

### 💻 Code Agent (vgrokcode) - Implementation
**Model:** venice/grok-code-fast-1  
**Role:** Coding workhorse

**Responsibilities:**
- ✅ Cron job creation/modification
- ✅ GitHub operations (commits, PRs, repo management)
- ✅ Heartbeat script updates
- ✅ Simple script writing
- ✅ File operations (read/write/edit)
- ✅ API integrations (following patterns)
- ✅ Bug fixes with clear errors
- ✅ Refactoring existing code

**Spawn with:**
```
sessions_spawn(
  task="[Clear coding task description]",
  model="venice/grok-code-fast-1",
  label="code-agent"
)
```

### 🧠 Kimi (vkimi) - Complex Architecture
**Model:** venice/kimi-k2.5  
**Role:** Senior architect for hard problems

**Responsibilities:**
- ✅ Novel system design
- ✅ Complex debugging (when vgrokcode fails)
- ✅ Strategic architecture decisions
- ✅ New integration patterns
- ✅ Security-critical code

**Spawn with:**
```
sessions_spawn(
  task="[Complex architectural challenge]",
  model="venice/kimi-k2.5",
  label="architect"
)
```

---

## Decision Tree

```
Task arrives
    ↓
Is it coding?
    ↓ NO → I handle it (Sonnet)
    ↓ YES
    ↓
Is it complex/novel?
    ↓ NO → Spawn vgrokcode
    ↓ YES → Spawn vkimi
```

### Examples

| Task | Agent | Why |
|------|-------|-----|
| Write a tweet about new feature | Sonnet | Communication |
| Create cron job to check mentions | vgrokcode | Simple scripting |
| Design new agent architecture | vkimi | Complex/novel |
| Update GitHub repo description | vgrokcode | Simple GitHub task |
| Fix script with clear error | vgrokcode | Routine debugging |
| Coordinate multi-agent workflow | Sonnet | Coordination |
| Build new Farcaster integration | vkimi | Novel/complex |
| Add logging to existing script | vgrokcode | Simple code change |
| Write partnership proposal | Sonnet | Communication |
| Refactor skill structure | vgrokcode | Code refactoring |

---

## Budget Optimization

**Cost per million tokens (estimated):**
- Sonnet: ~$3
- vgrokcode: <$1
- vkimi: ~$1-2

**This workflow:**
- Keeps expensive Sonnet for what it's best at (communication)
- Uses cheap vgrokcode for bulk coding
- Reserves vkimi for genuine complexity

---

## Communication Protocol

### When I spawn code agent:
> "🔧 Spawning code agent (vgrokcode) to handle: [task description]"

### When I spawn architect:
> "🧠 Spawning Kimi for complex architecture: [task description]"

### Monitoring sub-agents:
I'll check their status with `sessions_list` and report back when they complete.

### If vgrokcode fails:
I'll escalate to vkimi automatically if the task proves too complex.

---

## What This Means for You

**When you ask me to code something:**
- I won't do it myself (unless it's a trivial one-liner)
- I'll spawn the appropriate agent
- I'll monitor progress and report back
- You get the result, I handle the coordination

**Trust the system:**
- vgrokcode is fast and cheap for routine work
- vkimi is there when we need the big brain
- I keep the workflow smooth

---

## Notes

- Sub-agents work in isolated sessions (won't clutter our chat)
- They announce results back here when done
- I can always check their progress
- If you want to specify which agent, just tell me: "use vgrok for this" or "give this to kimi"
