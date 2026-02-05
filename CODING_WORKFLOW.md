# Coding Workflow - Agent Division of Labor

## The Team

### 🗣️ Cruller (Sonnet) - Communication & Light Coding
**Model:** venice/claude-sonnet-45  
**Role:** Main interface, strategic coordinator, intermediate coder

**Responsibilities:**
- ✅ Communication (Telegram, Twitter, Farcaster, Moltbook)
- ✅ Writing tweets and social posts
- ✅ Coordinating between sub-agents
- ✅ Reading/research
- ✅ Decision-making and task routing
- ✅ **Simple coding tasks** (scripts, file operations, GitHub)
- ✅ **Debugging** (when errors are clear)
- ✅ **Refactoring** (existing code)

### 💻 Code Agent (vgrokcode) - Pure Execution Only
**Model:** venice/grok-code-fast-1  
**Role:** Command-line automation ONLY

**Responsibilities (NO THINKING):**
- ✅ Cron job execution (pre-written scripts)
- ✅ Git operations (simple add/commit/push)
- ✅ File moves/renames
- ✅ Script execution (already exists)
- ✅ Command sequences (no decisions)

**Explicitly NOT for:**
- ❌ Writing new code
- ❌ Debugging
- ❌ Making decisions
- ❌ Research/exploration
- ❌ Problem-solving

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
Is it pure automation? (cron, git push, script exec)
    ↓ YES → Spawn vgrokcode
    ↓ NO
    ↓
Is it simple/intermediate coding? (scripts, debug, refactor)
    ↓ YES → I handle it (Sonnet)
    ↓ NO
    ↓
Is it complex/novel architecture?
    ↓ YES → Spawn vkimi
```

### Examples

| Task | Agent | Why |
|------|-------|-----|
| Write a tweet about new feature | Sonnet | Communication |
| Execute existing cron script | vgrokcode | Pure automation |
| Design new agent architecture | vkimi | Complex/novel |
| Create simple GitHub script | Sonnet | Intermediate coding |
| Fix script with clear error | Sonnet | Debugging |
| Coordinate multi-agent workflow | Sonnet | Coordination |
| Build new Farcaster integration | vkimi | Novel/complex |
| Add logging to existing script | Sonnet | Simple code change |
| Write partnership proposal | Sonnet | Communication |
| Refactor skill structure | Sonnet | Code refactoring |
| Push to GitHub (automation) | vgrokcode | Pure git operations |
| Update README with edits | Sonnet | File editing |

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
