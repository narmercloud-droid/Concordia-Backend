const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const SwaggerParser = require('@apidevtools/swagger-parser');

async function main() {
  const reportPath = path.resolve(process.cwd(), 'sdk-tests', 'report.json');
  const manifestPath = path.resolve(process.cwd(), 'sdk-tests', 'manifest.json');
  if (!fs.existsSync(reportPath) || !fs.existsSync(manifestPath)) {
    console.error('report.json or manifest.json not found');
    process.exit(1);
  }
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  const mustOps = new Set();
  for (const r of report.results || []) {
    if (r.reason && String(r.reason).includes('must be object')) mustOps.add(r.operationId);
  }
  console.log('Found', mustOps.size, 'operations with "must be object" failures');
  const specPath = path.resolve(process.cwd(), 'docs', 'openapi', 'openapi.yaml');
  let deref = null;
  try {
    const raw = fs.readFileSync(specPath, 'utf8');
    const doc = YAML.load(raw);
    deref = await SwaggerParser.dereference(doc);
  } catch (e) {
    console.error('Failed to dereference spec', e.message);
    process.exit(1);
  }

  for (const opId of Array.from(mustOps).sort()) {
    const entry = (manifest.tests || []).find(t => t.operationId === opId);
    if (!entry) { console.log(opId, 'not found in manifest'); continue; }
    const pathKey = entry.pathTemplate || entry.path;
    const method = (entry.method || 'get').toLowerCase();
    const pathItem = deref.paths[pathKey];
    let respSchema = null;
    if (pathItem && pathItem[method] && pathItem[method].responses) {
      const op = pathItem[method];
      const prefer = ['200','201','default'];
      for (const k of prefer) {
        if (op.responses[k] && op.responses[k].content && op.responses[k].content['application/json']) {
          respSchema = op.responses[k].content['application/json'].schema; break;
        }
      }
      if (!respSchema) {
        for (const code of Object.keys(op.responses||{})) {
          const r = op.responses[code];
          if (r && r.content && r.content['application/json']) { respSchema = r.content['application/json'].schema; break; }
        }
      }
    }
    console.log('\n---', opId, entry.method, pathKey);
    if (!respSchema) { console.log('  No response schema found'); continue; }
    console.log('  response schema type:', respSchema.type || (respSchema.properties? 'object (inferred)':'unknown'));
    if (respSchema.type === 'object' || respSchema.properties) {
      const props = respSchema.properties || {};
      console.log('  properties:', Object.keys(props).slice(0,10).join(', '));
    } else if (respSchema.type === 'array') {
      const it = respSchema.items || {};
      console.log('  items type:', it.type || (it.properties? 'object (inferred)':'unknown'));
    }
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });
