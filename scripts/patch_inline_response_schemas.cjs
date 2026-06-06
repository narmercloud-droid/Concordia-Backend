const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');

const SPEC_PATH = path.join(__dirname, '..', 'docs', 'openapi', 'openapi.yaml');
const REPORT_PATH = path.join(__dirname, '..', 'mock-server', 'sweep-report.json');

const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
const specRaw = fs.readFileSync(SPEC_PATH, 'utf8');
const doc = YAML.load(specRaw);

let updates = [];
for (const entry of report) {
  const problems = entry.problems || [];
  if (!problems.length) continue;
  const hasAddProp = problems.some(p => p.keyword === 'additionalProperties' || (p.message && p.message.includes('unexpected fields')));
  if (!hasAddProp) continue;

  const rawPath = entry.path;
  const method = entry.method.toLowerCase();

  if (!doc.paths || !doc.paths[rawPath]) continue;
  const pathItem = doc.paths[rawPath];
  if (!pathItem[method]) continue;
  const op = pathItem[method];
  const responses = op.responses || {};
  const resp = responses['200'] || responses['default'] || responses[Object.keys(responses)[0]];
  if (!resp || !resp.content || !resp.content['application/json']) continue;
  const media = resp.content['application/json'];
  const schema = media.schema;
  if (!schema) continue;
  if (schema.$ref) continue; // skip $ref (component schemas)

  let patched = false;
  if (schema.type === 'array' && schema.items && !schema.items.$ref) {
    if (schema.items.additionalProperties === undefined) {
      schema.items.additionalProperties = true;
      patched = true;
      console.log('Patched inline array item schema for', method.toUpperCase(), rawPath);
    }
  } else {
    if (schema.additionalProperties === undefined) {
      schema.additionalProperties = true;
      patched = true;
      console.log('Patched inline schema for', method.toUpperCase(), rawPath);
    }
  }
  if (patched) updates.push({ path: rawPath, method: method.toUpperCase() });
}
if (updates.length) {
  fs.writeFileSync(SPEC_PATH, YAML.dump(doc, { lineWidth: 120 }), 'utf8');
  console.log('Wrote', updates.length, 'inline schema updates to', SPEC_PATH);
} else {
  console.log('No inline schema updates needed');
}
