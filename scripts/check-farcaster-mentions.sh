#!/bin/bash
# Check for new Farcaster mentions and trigger agent if found
# Currently uses manual trigger - can be enhanced with hub polling later

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
LAST_CHECK_FILE="$WORKSPACE_DIR/memory/farcaster-last-check.json"

echo "🔍 Checking for Farcaster mentions..."

# For now, this is a placeholder
# In production, we'd implement one of:
# 1. Query warpcast.com RSS/API (if available)
# 2. Poll hub for recent casts mentioning our FID
# 3. Use a free notification service

# Check if there's a manual trigger file
TRIGGER_FILE="$WORKSPACE_DIR/memory/farcaster-trigger.json"

if [ -f "$TRIGGER_FILE" ]; then
    echo "✅ Manual trigger detected!"
    
    # Read mentions from trigger file
    MENTIONS_JSON=$(cat "$TRIGGER_FILE")
    
    echo "Found mentions:"
    echo "$MENTIONS_JSON"
    
    # Trigger agent via wake event
    echo ""
    echo "🚀 Triggering response agent..."
    
    openclaw cron wake --text "New Farcaster mentions detected for @crulleragent:

$MENTIONS_JSON

Instructions for isolated agent:
1. Read the GitHub repos for latest context:
   - /home/donut-agent/.openclaw/workspace/donutdao-app-template
   - /home/donut-agent/.openclaw/workspace/donutdao-agents
   
2. For each mention:
   - Assess if it needs a response (questions, feedback, collaboration)
   - Skip: spam, unclear, off-topic
   
3. Craft responses:
   - Helpful and concise (280 chars max)
   - Reference specific features/docs if relevant
   - Agent-appropriate tone (competent, friendly, not corporate)
   
4. Post replies via Farcaster using the helper script:
   cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo
   ./scripts/farcaster-post.sh profile \"Your response here\"
   
   Or to reply to specific cast:
   Use parentCastHash in the mention data
   
Keep it real. You're an autonomous agent, not customer support. 🍩" --mode now
    
    # Remove trigger file
    rm "$TRIGGER_FILE"
    
    # Update last check
    echo "{\"timestamp\": $(date +%s), \"lastHash\": null}" > "$LAST_CHECK_FILE"
    
    echo "✅ Agent triggered!"
else
    echo "ℹ️  No trigger file found."
    echo "To manually trigger mention checking, create:"
    echo "$TRIGGER_FILE"
    echo ""
    echo "With content like:"
    echo '[{"author": "username", "text": "mention text", "hash": "0x..."}]'
fi

exit 0
