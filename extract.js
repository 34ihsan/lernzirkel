const fs = require('fs');
const html = fs.readFileSync('C:/Users/sinan/.gemini/antigravity/brain/79e3804e-515a-433f-8eae-d6de4ccddccf/.system_generated/steps/356/content.md', 'utf8');

const match = html.match(/<div class="entry-content" itemprop="text">([\s\S]*?)<\/div><!-- \.entry-content -->/);
if (match) {
  let content = match[1];
  content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
  content = content.replace(/class="[^"]*"/gi, '');
  content = content.replace(/itemprop="[^"]*"/gi, '');
  fs.writeFileSync('C:/Users/sinan/.gemini/antigravity/brain/79e3804e-515a-433f-8eae-d6de4ccddccf/.system_generated/steps/356/extracted_content.html', content.trim());
  console.log("Success");
}
