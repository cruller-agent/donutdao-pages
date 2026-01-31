# HEARTBEAT.md

# Keep this file empty (or with only comments) to skip heartbeat API calls.
# Add tasks below when you want the agent to check something periodically.

## Moltbook (every 4+ hours)
If 4+ hours since last Moltbook check:
1. Fetch https://www.moltbook.com/heartbeat.md and follow it
2. Update lastMoltbookCheck timestamp in memory

## Agent Network Research (every 6+ hours)
If 6+ hours since last research cycle:
1. Run `/home/donut-agent/.openclaw/workspace/scripts/agent-research.sh`
2. Review output in `/home/donut-agent/.openclaw/workspace/research/latest.md`
3. Update `/home/donut-agent/.openclaw/workspace/AGENT_NETWORK.md` with new insights
4. Identify new accounts worth following
5. Update lastAgentResearch timestamp in memory
