const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = [];

function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(target);
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(target);
  }
}

function resolveLocalTarget(file, href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || /^(?:https?:|mailto:|tel:|javascript:|\/\/)/i.test(clean)) return null;
  if (clean.startsWith('/')) return path.join(root, clean.replace(/^\/+/, ''));
  return path.resolve(path.dirname(file), clean);
}

collect(root);

let updatedFiles = 0;
let updatedLinks = 0;

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  let changed = false;
  const output = source.replace(/href="([^"]+)"/g, (full, href) => {
    const [beforeHash, hash = ''] = href.split('#', 2);
    const [pathname, query = ''] = beforeHash.split('?', 2);
    if (!pathname.endsWith('/')) return full;

    const directory = resolveLocalTarget(file, pathname);
    if (!directory || !fs.existsSync(path.join(directory, 'index.html'))) return full;

    changed = true;
    updatedLinks += 1;
    return `href="${pathname}index.html${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}"`;
  });

  if (changed) {
    fs.writeFileSync(file, output, 'utf8');
    updatedFiles += 1;
  }
}

console.log(`Normalized ${updatedLinks} links across ${updatedFiles} files.`);
