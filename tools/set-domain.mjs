import fs from 'node:fs';
import path from 'node:path';

const domain = process.argv[2]?.replace(/\/$/, '');
if (!domain || !/^https:\/\//.test(domain)) {
  console.error('Usage: node tools/set-domain.mjs https://example.com');
  process.exit(1);
}
const root = path.resolve(new URL('..', import.meta.url).pathname);
const files = fs.readdirSync(root).filter(name => name.endsWith('.html') || ['robots.txt','sitemap.xml'].includes(name));
for (const name of files) {
  const file = path.join(root, name);
  const old = fs.readFileSync(file, 'utf8');
  const next = old.replaceAll('https://your-domain.com', domain);
  fs.writeFileSync(file, next);
  console.log(`Updated ${name}`);
}
