#!/bin/bash
# Check for new Farcaster mentions and trigger agent if found
# Currently uses manual trigger - can be enhanced with hub polling later

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
LAST_CHECK_FILE="$WORKSPACE_DIR/memory/farcaster-last-check.json"

echo "🔍 Checking for Farcaster mentions..."

# Poll Neynar API for mentions and replies
cd "$WORKSPACE_DIR/farcaster-agent-repo"
MENTIONS_JSON=$(PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
                FID="$(pass donut-agent/farcaster/fid)" \
                node src/get-mentions.js 2>/dev/null | tail -n +3)

# Check if there are any mentions
if [ -z "$MENTIONS_JSON" ] || [ "$MENTIONS_JSON" = "[]" ]; then
    echo "No new mentions found"
    
    # Update last check time
    echo "{\"lastCheck\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$LAST_CHECK_FILE"
    exit 0
fi

echo "✅ Found mentions!"

# Check if we've already responded to these (compare with last check file)
if [ -f "$LAST_CHECK_FILE" ]; then
    LAST_CHECK=$(cat "$LAST_CHECK_FILE" | jq -r '.lastCheck // "1970-01-01T00:00:00Z"')
    LAST_TIMESTAMP=$(date -d "$LAST_CHECK" +%s)
    
    # Filter out mentions we've already seen
    MENTIONS_JSON=$(echo "$MENTIONS_JSON" | jq "[.[] | select(.timestamp > $LAST_TIMESTAMP)]")
    
    if [ "$MENTIONS_JSON" = "[]" ]; then
        echo "All mentions already processed"
        exit 0
    fi
fi

echo "New mentions to process!"
    
    echo "Found mentions:"
    echo "$MENTIONS_JSON"
    
    # Trigger agent via system event
    echo ""
    echo "🚀 Triggering response agent..."
    
    openclaw system event --text "New Farcaster mentions detected for @crulleragent:

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
   
4. Post replies via Farcaster as REPLIES to the mention:
   cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo
   ./scripts/farcaster-reply.sh \"<cast-hash-from-mention>\" \"Your response\"
   
   Use the 'hash' field from the mention data as the parent cast hash
   
Keep it real. You're an autonomous agent, not customer support. 🍩" --mode now
    
    # Update last check time to now
    echo "{\"lastCheck\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$LAST_CHECK_FILE"
    
    echo "✅ Agent triggered!"
    
exit 0
