const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');

const SPEC_PATH = path.join(__dirname, '..', 'docs', 'openapi', 'openapi.yaml');
const raw = fs.readFileSync(SPEC_PATH, 'utf8');
const doc = YAML.load(raw);
let changed = 0;
if (!doc.components || !doc.components.schemas) {
  console.error('No components.schemas found');
  process.exit(1);
}
for (const k of Object.keys(doc.components.schemas)) {
  const s = doc.components.schemas[k];
  if (s && typeof s === 'object') {
    if (s.additionalProperties === undefined) {
      s.additionalProperties = true;
      changed++;
      console.log('Added additionalProperties:true to', k);
    }
  }
}
if (changed > 0) {
  fs.writeFileSync(SPEC_PATH, YAML.dump(doc, { lineWidth: 120 }), 'utf8');
  console.log('Wrote', changed, 'schema updates to', SPEC_PATH);
} else {
  console.log('No updates needed');
}
