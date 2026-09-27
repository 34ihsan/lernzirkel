const fs = require('fs');

['444', '446', '448'].forEach(step => {
  const file = 'C:/Users/sinan/.gemini/antigravity/brain/5845c72c-a1e7-41dd-b6f7-90382d682e81/.system_generated/steps/' + step + '/content.md';
  const text = fs.readFileSync(file, 'utf8');
  
  const links = [...text.matchAll(/https?:\/\/lernzirkel-online\.de[^\s)"]*/g)].map(m => m[0]);
  
  console.log('--- Step ' + step + ' ---');
  console.log('Found old links:', [...new Set(links)]);
  
  // also check mail addresses
  const mails = [...text.matchAll(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/g)].map(m => m[0]);
  console.log('Found emails:', [...new Set(mails)]);
});
