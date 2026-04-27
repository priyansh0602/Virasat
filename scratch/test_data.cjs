const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'data', 'StateData.js');
const content = fs.readFileSync(file, 'utf8');

const coordsMatch = content.match(/export const STATE_COORDS = \{([\s\S]*?)\};/);
const states = [];
if (coordsMatch) {
  const lines = coordsMatch[1].split('\n');
  for (const line of lines) {
    const m = line.match(/'([^']+)'/);
    if (m) states.push(m[1]);
  }
}

const getKeys = (blockName) => {
  const blockRegex = new RegExp(`export const ${blockName} = \\{([\\s\\S]*?)\\};`);
  const match = content.match(blockRegex);
  if (!match) return [];
  const keys = [];
  const regex = /'([^']+)':\s*\[/g;
  let m;
  while ((m = regex.exec(match[1])) !== null) {
    keys.push(m[1]);
  }
  return keys;
}

const heritageKeys = getKeys('STATE_HERITAGE');
const iconKeys = getKeys('STATE_ICONS');
const timelineKeys = getKeys('STATE_TIMELINES');

console.log('Total States in Coords:', states.length);
console.log('Missing Heritage:', states.filter(s => !heritageKeys.includes(s)));
console.log('Missing Icons:', states.filter(s => !iconKeys.includes(s)));
console.log('Missing Timelines:', states.filter(s => !timelineKeys.includes(s)));
