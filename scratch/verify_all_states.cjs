/**
 * Comprehensive verification: 
 * Check that every state from the Onboarding dropdown maps correctly
 * to STATE_HERITAGE, STATE_ICONS, and STATE_TIMELINES in StateData.js
 */
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'data', 'StateData.js'), 'utf8'
);

// These are the EXACT state names from Onboarding.jsx dropdown
const ONBOARDING_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories
  'Delhi (NCT)', 'Jammu & Kashmir',
];

// Extract keys from each block
const getKeys = (blockName) => {
  const blockRegex = new RegExp(`export const ${blockName} = \\{([\\s\\S]*?)\\};`);
  const match = content.match(blockRegex);
  if (!match) return [];
  const keys = [];
  const regex = /'([^']+)':\s*[\[{]/g;
  let m;
  while ((m = regex.exec(match[1])) !== null) {
    keys.push(m[1]);
  }
  return keys;
}

const heritageKeys = getKeys('STATE_HERITAGE');
const iconKeys = getKeys('STATE_ICONS');
const timelineKeys = getKeys('STATE_TIMELINES');
const coordKeys = getKeys('STATE_COORDS');

console.log('========================================');
console.log('  VIRASAT STATE DATA VERIFICATION');
console.log('========================================\n');

let allGood = true;

for (const state of ONBOARDING_STATES) {
  const key = state.trim().toLowerCase();
  const hasHeritage = heritageKeys.includes(key);
  const hasIcons = iconKeys.includes(key);
  const hasTimeline = timelineKeys.includes(key);
  const hasCoords = coordKeys.includes(key);
  
  const status = (hasHeritage && hasIcons && hasTimeline && hasCoords) ? '✅' : '❌';
  if (status === '❌') allGood = false;
  
  console.log(`${status} ${state.padEnd(25)} | Heritage: ${hasHeritage ? '✓' : '✗'} | Icons: ${hasIcons ? '✓' : '✗'} | Timeline: ${hasTimeline ? '✓' : '✗'} | Coords: ${hasCoords ? '✓' : '✗'}`);
}

console.log('\n========================================');
if (allGood) {
  console.log('  🎉 ALL STATES VERIFIED SUCCESSFULLY!');
} else {
  console.log('  ⚠️  SOME STATES ARE MISSING DATA!');
}
console.log('========================================');
