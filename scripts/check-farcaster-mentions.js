#!/usr/bin/env node
/**
 * Check for new Farcaster mentions
 * Uses hub protocol (free) to query mentions
 * Returns new mentions since last check
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const FID = 2647465; // @crulleragent
const HUB_URL = 'nemes.farcaster.xyz:2283';
const LAST_CHECK_FILE = path.join(__dirname, '../memory/farcaster-last-check.json');

// Load last check data
function loadLastCheck() {
  try {
    if (fs.existsSync(LAST_CHECK_FILE)) {
      return JSON.parse(fs.readFileSync(LAST_CHECK_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading last check:', e.message);
  }
  return { timestamp: 0, lastHash: null };
}

// Save last check data
function saveLastCheck(data) {
  fs.writeFileSync(LAST_CHECK_FILE, JSON.stringify(data, null, 2));
}

// Query hub for casts mentioning our FID
async function checkMentions() {
  // For now, use our farcaster-agent-repo scripts
  // In production, we'd query the hub directly
  const { execSync } = require('child_process');
  
  try {
    // Use our existing scripts to get mentions
    // This is a placeholder - we'll need to implement proper hub querying
    const result = execSync(
      `cd /home/donut-agent/.openclaw/workspace/farcaster-agent-repo && \
       PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)" \
       SIGNER_PRIVATE_KEY="$(pass donut-agent/farcaster/signer-private-key)" \
       FID="${FID}" \
       node src/get-notifications.js 2>/dev/null || echo "[]"`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );
    
    return JSON.parse(result || '[]');
  } catch (e) {
    console.error('Error checking mentions:', e.message);
    return [];
  }
}

// Format mentions for agent
function formatMentions(mentions) {
  return mentions.map(m => {
    return {
      author: m.author?.username || m.author?.fid || 'unknown',
      authorFid: m.author?.fid,
      text: m.text || '',
      hash: m.hash,
      timestamp: m.timestamp,
      parentHash: m.parentHash // If it's a reply
    };
  });
}

// Main
async function main() {
  const lastCheck = loadLastCheck();
  const now = Math.floor(Date.now() / 1000);
  
  console.log(`Checking for mentions since ${new Date(lastCheck.timestamp * 1000).toISOString()}...`);
  
  const mentions = await checkMentions();
  
  // Filter for new mentions since last check
  const newMentions = mentions.filter(m => {
    const mentionTime = m.timestamp || 0;
    return mentionTime > lastCheck.timestamp && m.hash !== lastCheck.lastHash;
  });
  
  if (newMentions.length === 0) {
    console.log('No new mentions found.');
    return;
  }
  
  console.log(`Found ${newMentions.length} new mention(s)!`);
  
  // Format for output
  const formatted = formatMentions(newMentions);
  console.log(JSON.stringify(formatted, null, 2));
  
  // Save last check
  if (newMentions.length > 0) {
    saveLastCheck({
      timestamp: now,
      lastHash: newMentions[0].hash
    });
  }
}

main().catch(console.error);
