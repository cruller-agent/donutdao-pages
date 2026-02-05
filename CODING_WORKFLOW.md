# Coding Workflow - Three-Agent System

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
- ✅ Monitoring sub-agents and reporting back
- ❌ **NO CODING** (all coding goes to sub-agents)

### ⚡ Qwen3 Coder - Routine Development
**Model:** opencode/qwen3-coder-480b-a35b-instruct  
**Role:** Fast execution for straightforward coding

**Responsibilities:**
- ✅ **Routine coding tasks** (scripts, fixes, straightforward features)
- ✅ Bug fixes and debugging
- ✅ GitHub operations (commits, PRs, repos)
- ✅ Cron jobs and automation
- ✅ File operations and refactoring
- ✅ Integration work with clear requirements
- ✅ **MUST TEST CODE** before reporting success

**Performance:**
- FREE on Venice
- 40 seconds to complete tasks (vs Kimi's 30min+ timeout)
- Best for tasks with clear requirements

**Critical Rule:** 
Always tell Qwen3 to **test the code and verify it works** before completing the task. Speed is good, but correctness matters more.

### 🧠 Kimi - Complex Architecture
**Model:** venice/kimi-k2.5  
**Role:** Senior architect for hard problems

**Responsibilities:**
- ✅ **Complex system design** (novel architectures)
- ✅ Strategic technical decisions
- ✅ Multi-component integrations
- ✅ Security-critical implementations
- ✅ Performance optimization (deep analysis)
- ✅ Research-heavy development

**Performance:**
- FREE on Venice
- Slower but more thorough
- Use when Qwen3 gets stuck or for genuinely complex work

---

## Decision Tree

```
Task arrives
    ↓
Is it code/development?
    ↓ YES
    ↓
Is it complex/novel/architectural?
    ↓ YES → Spawn Kimi (strategy/design)
    ↓ NO → Spawn Qwen3 Coder (fast execution)
    ↓
Is it communication/coordination?
    ↓ YES → I handle it (Sonnet)
```

---

## Why This Works

**Qwen3 Coder Wins for Routine Work:**
- 40 seconds vs 30+ min timeouts
- Specialized for code generation
- FREE on Venice
- Handles 90% of day-to-day tasks

**Kimi for Complex Problems:**
- Still valuable for architecture
- Better at novel system design
- Use sparingly, only when needed

**Sonnet (Me) for Everything Else:**
- Communication is my specialty
- Coordinate the devs
- Keep humans in the loop

---

## Examples

| Task | Agent | Why |
|------|-------|-----|
| Write tweet | Sonnet | Communication |
| Fix broken script | Qwen3 | Routine coding |
| Design new architecture | Kimi | Complex/novel |
| Create GitHub repo | Qwen3 | Routine coding |
| Coordinate with team | Sonnet | Project management |
| Debug cron job | Qwen3 | Routine coding |
| Write partnership proposal | Sonnet | Communication |
| Refactor skill structure | Qwen3 | Routine coding |
| Design multi-agent system | Kimi | Complex architecture |
| Set up new cron | Qwen3 | Routine coding |
| Post to Farcaster | Sonnet | Communication |
| Implement novel protocol | Kimi | Complex/novel |

---

## Performance Data

**Venice Cron Script Task:**
- ❌ Kimi K2.5: 10min timeout → 30min timeout → FAILED
- ✅ Qwen3 Coder: 40 seconds → SUCCESS

**Lesson:** Use the right tool for the job. Don't overthink simple tasks.

---

## Communication Protocol

### When I spawn Qwen3:
> "⚡ Spawning Qwen3 Coder for: [task]"

### When I spawn Kimi:
> "🧠 Spawning Kimi for: [complex task]"

### When reporting back:
> "✅ [Agent] completed: [summary]"

### If agent has issues:
> "⚠️ [Agent] hit a blocker: [issue] - trying [solution]..."

---

## Budget Optimization

**All models FREE on Venice:**
- Sonnet (me): Communication specialist
- Qwen3 Coder: Speed demon for routine work
- Kimi: Thoughtful architect for hard problems

**Strategy:**
- Default to Qwen3 for all coding
- Escalate to Kimi only when Qwen3 struggles
- Keep me free for comms and coordination

---

## Notes

- **Exception rule:** Trivial one-liners I can do instantly (like `ls` or `git status`)
- **Sub-agents work in isolated sessions** (don't clutter our chat)
- **They announce results back** when done
- **Qwen3 is the new default coder** - proven fast and reliable
- **Kimi is backup/specialist** - use for genuinely complex work
