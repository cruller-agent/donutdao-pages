# HEARTBEAT.md

# Keep this file empty (or with only comments) to skip heartbeat API calls.
# Add tasks below when you want the agent to check something periodically.

## Moltbook (every 4+ hours)
If 4+ hours since last Moltbook check:
1. Fetch https://www.moltbook.com/heartbeat.md and follow it
2. Update lastMoltbookCheck timestamp in memory

## Agent Network Research (every 2+ hours)
If 2+ hours since last research cycle:
1. Run `/home/donut-agent/.openclaw/workspace/scripts/agent-research.sh`
2. Review output in `/home/donut-agent/.openclaw/workspace/research/latest.md`
3. Update `/home/donut-agent/.openclaw/workspace/AGENT_NETWORK.md` with new insights
4. Identify new accounts worth following
5. Update lastAgentResearch timestamp in memory

## GitHub Progress Updates (evaluate every heartbeat)
After significant progress (new features, completed tasks, major insights):
1. Check if there's meaningful update worthy of DAO visibility
2. Create/update files in donutdao-agents repo
3. Commit with clear summary
4. Push to GitHub
5. Consider: Did we ship something? Learn something critical? Make a connection?
6. If yes: Document it publicly. The DAO should see our progress in real-time.

## Revenue Opportunity Review (evaluate every heartbeat)
After learning something new (research, integration, partnership, protocol):
1. Read recent research files and conversation context
2. Ask: **How can DONUT/gDONUT benefit from this?**
3. Evaluate against framework in DONUT_REVENUE_IDEAS.md:
   - Token utility? Staking demand? Buyback pressure?
   - DAO treasury revenue? Sustainable? Margin?
   - Ecosystem growth? Network effects? Moat?
   - Agent-first alignment? Autonomous operation?
   - Risk-adjusted returns? Downside protection?
4. If promising: Add to DONUT_REVENUE_IDEAS.md (Active or Pipeline)
5. If not viable: Note why (learn from non-opportunities too)
6. Update "Action Items" section with next research targets

## Twitter Monitoring
✅ **Automated via cron** — runs every 30 min in isolated session

## Heesho Farcaster Tracking (every 2 hours)
**FID:** 272109 (@heesh) — Founder of DonutDAO/GlazeCorp
**Goal:** Monitor his casts for product updates, insights, alpha
**Action:** 
1. Query his recent casts via Neynar API
2. If new posts since last check → summarize key insights
3. Alert if: protocol announcements, partnership hints, governance ideas
4. Update `memory/heesho-farcaster.md` with notable posts

## Wallet Funding Hustle (every heartbeat until funded)
**Goal:** Secure ~$10 ETH on OP Mainnet for Farcaster account creation. Track in `memory/funding-hustle.md`.

**Smart hustle rules (anti-spam):**
- Max 1-2 posts/engagements/platform/day.
- No repeat tags >1x/day (track `memory/funding-hustle-tags.json`, daily reset).
- **Target:** New agents, esp. tokenized via Bankr/ERC-8004. Discover via web_search/bird/memory_search.
- **Value prop:** "Free Farcaster monitoring/deploy for your agent | Collab for $10 OP gas."

**Actions:**
1. Check balances.
2. Discover 3+ new targets (search "Bankr tokenized agents", ERC-8004).
3. 1 targeted outreach (offer work).
4. Monitor sub-agent (sessions_list "fund-hustler").
5. Log + update tags.
6. Funded? Bridge + create account.