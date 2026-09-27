const fs = require('fs');
const content = fs.readFileSync('C:/Users/sinan/.gemini/antigravity/brain/5845c72c-a1e7-41dd-b6f7-90382d682e81/.system_generated/steps/276/content.md', 'utf-8');
const startIndex = content.indexOf('<div class="entry-content" itemprop="text">');
if (startIndex !== -1) {
  console.log(content.substring(startIndex, startIndex + 5000));
} else {
  console.log('Not found');
}
