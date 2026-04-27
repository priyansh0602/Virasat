const fs = require('fs');
const https = require('https');
const path = require('path');

async function fetchWikiThumb(title) {
  return new Promise((resolve) => {
    https.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.thumbnail && json.thumbnail.source) {
            resolve(json.thumbnail.source);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

(async () => {
  const file = path.join(__dirname, '..', 'src', 'data', 'StateData.js');
  let content = fs.readFileSync(file, 'utf8');

  // Match all thumbnail: img('...')
  const regex = /title:\s*'([^']+)',\s*snippet:\s*'[^']+',\s*thumbnail:\s*img\('[^']+'\)/g;
  
  let match;
  const updates = [];

  while ((match = regex.exec(content)) !== null) {
    const title = match[1];
    const url = await fetchWikiThumb(title);
    if (url) {
      console.log(`Found ${title}: ${url}`);
      updates.push({ title, url });
    } else {
      console.log(`Failed ${title}`);
    }
  }

  // Replace them in content
  for (const update of updates) {
    const replaceRegex = new RegExp(`(title:\\s*'${update.title}',\\s*snippet:\\s*'[^']+',\\s*thumbnail:)\\s*img\\('[^']+'\\)`, 'g');
    content = content.replace(replaceRegex, `$1 '${update.url}'`);
  }

  fs.writeFileSync(file, content);
  console.log("Updated StateData.js!");
})();
