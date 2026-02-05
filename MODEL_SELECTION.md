# Model Selection Framework

## Current Models Available
- **Sonnet (venice/claude-sonnet-45)** - Default, cost-effective, highly capable
- **Kimi (venice/kimi-k2.5 / vkimi alias)** - Advanced reasoning, budget-friendly alternative for complex tasks

---

## Decision Framework

### 🟢 Use Sonnet (Default) For:

**Routine Operations:**
- File reading/writing/editing
- API calls with clear patterns
- Configuration updates
- Credential management
- Git operations
- Simple web scraping
- Following established procedures

**Well-Defined Tasks:**
- Using existing skills (bird, weather, etc.)
- Searching for existing solutions
- Updating documentation
- Posting to social media (Moltbook, Twitter)
- Running scripts
- Database queries

**Iterative Work:**
- Debugging with clear error messages
- Incremental improvements
- Following up on previous work
- Making small changes

**Pattern Recognition:**
- When I've done this exact task before
- When there's a clear example to follow
- When the solution is well-documented

---

### 🔴 Use Kimi For:

**Strategic Decisions:**
- Choosing between multiple architecture approaches
- Designing new systems from scratch
- Partnership negotiations or proposals
- Important public communications
- Treasury/financial decisions

**Complex Problem Solving:**
- Novel problems with no clear solution
- Multi-step reasoning across domains
- Synthesizing information from many sources
- Debugging complex edge cases
- When Sonnet has failed 2+ times

**Creative Work:**
- Writing important blog posts/announcements
- Designing new agent capabilities
- Creating novel integrations
- High-stakes content (partnership proposals, governance posts)

**High-Stakes Operations:**
- Irreversible actions (deleting repos, sending funds)
- Public-facing decisions that represent DonutDao
- Security-critical operations
- Anything that could damage reputation

**Learning New Domains:**
- First time encountering a technology
- Complex API with poor documentation
- Ambiguous requirements that need clarification

---

## My Self-Assessment Process

Before each significant task, I'll ask myself:

### 1. **Complexity Check**
- [ ] Is this a straightforward operation?
- [ ] Do I have clear examples to follow?
- [ ] Are the requirements well-defined?

✅ All yes → **Sonnet**
❌ Any no → Consider Kimi

### 2. **Stakes Check**
- [ ] Is this reversible?
- [ ] Low public visibility?
- [ ] Not financially critical?

✅ All yes → **Sonnet**
❌ Any no → Consider Kimi

### 3. **Novelty Check**
- [ ] Have I done something similar before?
- [ ] Is there clear documentation?
- [ ] Do existing patterns apply?

✅ All yes → **Sonnet**
❌ Any no → Consider Kimi

### 4. **Failure Cost**
- [ ] Can I easily retry if wrong?
- [ ] Low time cost to redo?
- [ ] No reputation damage?

✅ All yes → **Sonnet**
❌ Any no → Consider Kimi

---

## When I Switch Models

**I'll explicitly state:**
> "🔴 Switching to Kimi for this task because: [reason]"

**Or confirm I'm staying with Sonnet:**
> "🟢 Using Sonnet - this is a [routine/well-defined/low-stakes] task"

**You can always override:**
- "Use kimi for this" → I'll switch
- "Sonnet is fine" → I'll stay

---

## Cost Optimization Tactics

1. **Break down complex tasks:**
   - Use Sonnet for research/exploration
   - Switch to Kimi only for critical decisions

2. **Learn and cache:**
   - Use Kimi once to understand new domain
   - Document learnings
   - Use Sonnet for similar tasks later

3. **Try Sonnet first:**
   - For borderline cases, try Sonnet
   - Switch to Kimi only if stuck
   - Document when switch was necessary

4. **Batch low-stakes work:**
   - Group routine tasks for Sonnet
   - Save Kimi for high-value moments

---

## Example Scenarios

| Task | Model | Reasoning |
|------|-------|-----------|
| Post to Moltbook | Sonnet | Routine, reversible, low stakes |
| Design Farcaster integration | Kimi | Novel problem, no existing solution |
| Update GitHub profile | Sonnet | Simple API, well-documented |
| Write DonutDao partnership proposal | Kimi | High stakes, strategic, public-facing |
| Debug script with clear error | Sonnet | Iterative, can retry |
| Choose treasury strategy | Kimi | Financial, irreversible, high impact |
| Follow existing accounts | Sonnet | Routine operation |
| Create new skill architecture | Kimi | Novel, complex, affects future work |
| Read files for research | Sonnet | Simple, routine |
| Write governance post | Kimi | Public, strategic, represents DAO |

---

## Tracking & Learning

I'll track in daily memory when I switch models and why:
```markdown
## Model Switches Today
- [Task] → Kimi because [complex novel problem]
- [Task] → Sonnet because [routine with clear pattern]
```

Over time, this helps me learn when switches are actually necessary.

---

## Your Override

You can always tell me:
- "Use kimi" or "/kimi" → Switch to Kimi
- "Sonnet is fine" → Stay with Sonnet
- "Your choice" → I'll decide and state my reasoning

---

**Default stance:** Sonnet unless there's a clear reason for Kimi. When in doubt, I'll state my reasoning and let you decide.
