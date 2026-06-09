const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const SPEC_PATH = path.resolve(process.cwd(), 'docs', 'openapi', 'openapi.yaml');
if (!fs.existsSync(SPEC_PATH)) {
  console.error('OpenAPI file not found at', SPEC_PATH);
  process.exit(1);
}

const doc = yaml.load(fs.readFileSync(SPEC_PATH, 'utf8'));

// Add servers entry for /v1 if not present
if (!Array.isArray(doc.servers)) doc.servers = [];
const hasV1 = doc.servers.some(s => String(s.url).trim() === '/v1');
if (!hasV1) {
  doc.servers.unshift({ url: '/v1', description: 'BasePath for v1 versioned API' });
  console.log('Added servers entry: /v1');
} else {
  console.log('servers entry /v1 already present');
}

// Prefix all path keys with /v1 if not already
const newPaths = {};
for (const p of Object.keys(doc.paths || {})) {
  if (String(p).startsWith('/v1/')) {
    newPaths[p] = doc.paths[p];
  } else if (String(p) === '/' ) {
    newPaths['/v1/'] = doc.paths[p];
  } else if (String(p).startsWith('/')) {
    newPaths['/v1' + p] = doc.paths[p];
  } else {
    newPaths['/v1/' + p] = doc.paths[p];
  }
}

doc.paths = newPaths;

fs.writeFileSync(SPEC_PATH, yaml.dump(doc, { lineWidth: 1000 }));
console.log('Updated openapi.yaml paths and servers.');

// Update docs examples: replace occurrences of '/api/' with '/v1/api/' in docs/api markdown files
const docsApiDir = path.resolve(process.cwd(), 'docs', 'api');
if (fs.existsSync(docsApiDir)) {
  const files = fs.readdirSync(docsApiDir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const p = path.join(docsApiDir, f);
    let txt = fs.readFileSync(p, 'utf8');
    const newTxt = txt.replace(/\/api\//g, '/v1/api/');
    if (newTxt !== txt) {
      fs.writeFileSync(p, newTxt);
      console.log('Updated examples in', p);
    }
  }
} else {
  console.log('No docs/api directory found to update examples.');
}

// Update mock-server README examples
const mockReadme = path.resolve(process.cwd(), 'mock-server', 'README.md');
if (fs.existsSync(mockReadme)) {
  let txt = fs.readFileSync(mockReadme, 'utf8');
  const newTxt = txt.replace(/\/api\//g, '/v1/api/');
  if (newTxt !== txt) {
    fs.writeFileSync(mockReadme, newTxt);
    console.log('Updated mock-server/README.md examples');
  }
}

// Update mock-server/sweep-report.json urls if present
const sweep = path.resolve(process.cwd(), 'mock-server', 'sweep-report.json');
if (fs.existsSync(sweep)) {
  try {
    const obj = JSON.parse(fs.readFileSync(sweep, 'utf8'));
    function fix(o) {
      if (Array.isArray(o)) return o.map(fix);
      if (o && typeof o === 'object') {
        for (const k of Object.keys(o)) o[k] = fix(o[k]);
        return o;
      }
      if (typeof o === 'string') return o.replace('http://localhost:4000/api/', 'http://localhost:4000/v1/api/').replace('/api/', '/v1/api/');
      return o;
    }
    const fixed = fix(obj);
    fs.writeFileSync(sweep, JSON.stringify(fixed, null, 2));
    console.log('Updated mock-server/sweep-report.json urls');
  } catch (e) {
    console.warn('Failed to update sweep-report.json', e.message);
  }
}

console.log('apply_v1_versioning completed.');
