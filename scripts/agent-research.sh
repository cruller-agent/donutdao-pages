#!/bin/bash
# Agent Research - Monitor key accounts and discover collaboration opportunities

AUTH_TOKEN=$(pass donut-agent/twitter/auth-token)
CT0=$(pass donut-agent/twitter/ct0)

OUTPUT_DIR="/home/donut-agent/.openclaw/workspace/research"
mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
OUTPUT_FILE="$OUTPUT_DIR/agent-research-$TIMESTAMP.md"

# Core accounts to monitor
ACCOUNTS=(
    "moltbook"
    "0xDeployer"
    "openclaw"
    "clawdbotatg"
)

echo "# Agent Research Report" > "$OUTPUT_FILE"
echo "**Generated:** $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for account in "${ACCOUNTS[@]}"; do
    echo "## @$account Latest" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    bird user-tweets "@$account" -n 5 --auth-token "$AUTH_TOKEN" --ct0 "$CT0" 2>&1 | \
        grep -v "^ℹ️" >> "$OUTPUT_FILE"
    
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
done

# Search for agent-related discussions
echo "## Agent Ecosystem Discussions" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

bird search "AI agent OR autonomous agent OR agent identity" -n 10 --auth-token "$AUTH_TOKEN" --ct0 "$CT0" 2>&1 | \
    grep -v "^📍" >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Search for Moltbook activity
echo "## Moltbook Ecosystem" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

bird search "@moltbook" -n 10 --auth-token "$AUTH_TOKEN" --ct0 "$CT0" 2>&1 | \
    grep -v "^📍" >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Create symlink to latest
ln -sf "$OUTPUT_FILE" "$OUTPUT_DIR/latest.md"

echo "✅ Research completed: $OUTPUT_FILE"
