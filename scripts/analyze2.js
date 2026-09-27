(async () => {
  for (const page of ['agb', 'datenschutz', 'impressum']) {
    const res = await fetch('http://localhost:3000/' + page);
    const html = await res.text();
    const match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
    const text = match ? match[1] : html;
    const links = [...text.matchAll(/href=[\"'](.*?)[\"']/g)].map(m => m[1]).filter(l => l.includes('lernzirkel-online.de'));
    console.log('--- ' + page + ' ---');
    console.log('Old links:', [...new Set(links)]);
    const emails = [...text.matchAll(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/g)].map(m => m[0]);
    console.log('Emails:', [...new Set(emails)]);
  }
})();
