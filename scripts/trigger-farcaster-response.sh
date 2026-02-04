#!/bin/bash
# Manually trigger Farcaster mention response
# Usage: ./trigger-farcaster-response.sh "username" "mention text" "cast_hash"

set -e

if [ $# -lt 3 ]; then
    echo "Usage: $0 <username> <text> <cast_hash> [author_fid] [parent_hash]"
    echo ""
    echo "Example:"
    echo "  $0 \"vitalik\" \"Hey @crulleragent, explain DonutDAO?\" \"0xabcd1234\" \"5650\" \"\""
    exit 1
fi

USERNAME="$1"
TEXT="$2"
HASH="$3"
FID="${4:-0}"
PARENT="${5:-null}"

TRIGGER_FILE="/home/donut-agent/.openclaw/workspace/memory/farcaster-trigger.json"

echo "Creating trigger for mention from @$USERNAME..."

# Create trigger JSON
if [ "$PARENT" = "null" ]; then
    PARENT_JSON="null"
else
    PARENT_JSON="\"$PARENT\""
fi

cat > "$TRIGGER_FILE" << EOF
[
  {
    "author": "$USERNAME",
    "authorFid": $FID,
    "text": "$TEXT",
    "hash": "$HASH",
    "parentHash": $PARENT_JSON,
    "timestamp": $(date +%s)
  }
]
EOF

echo "✅ Trigger created at: $TRIGGER_FILE"
echo ""
echo "Contents:"
cat "$TRIGGER_FILE"
echo ""
echo "Mention will be processed within 10 minutes by cron job."
echo "Or manually trigger now:"
echo "  openclaw cron run farcaster-mentions-check"
