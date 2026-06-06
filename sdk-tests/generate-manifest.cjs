#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const openapiPath = path.resolve(process.cwd(), 'docs', 'openapi', 'openapi.yaml');
if (!fs.existsSync(openapiPath)) {
  console.error('OpenAPI file not found:', openapiPath);
  process.exitCode = 1;
  process.exit(1);
}

const doc = yaml.load(fs.readFileSync(openapiPath, 'utf8'));
const manifest = [];

for (const [p, methods] of Object.entries(doc.paths || {})) {
  // skip paths that only have 'parameters' entries and no real HTTP methods
  const methodKeys = Object.keys(methods || {}).map(k => String(k).toLowerCase());
  if (methodKeys.length === 0) continue;
  if (methodKeys.every(k => k === 'parameters')) continue;

  for (const [method, op] of Object.entries(methods)) {
    // skip OpenAPI 'parameters' pseudo-entries
    if (!method) continue;
    if (String(method).toLowerCase() === 'parameters') continue;
    const rawOperationId = op && op.operationId ? op.operationId : `${method}_${p.replace(/[\\/{}]/g, '_')}`;
    // skip generated parameter-only operationIds
    if (String(rawOperationId).startsWith('parameters__')) continue;
    const operationId = rawOperationId;
    let requestSchema = null;
    if (op.requestBody && op.requestBody.content && op.requestBody.content['application/json']) {
      requestSchema = op.requestBody.content['application/json'].schema || null;
    }

    // collect parameter schemas (path, query, header)
    const parameters = (op.parameters || []).map(param => {
      return {
        name: param.name,
        in: param.in,
        required: !!param.required,
        schema: param.schema || null
      };
    });

    let responseSchema = null;
    const responses = op.responses || {};
    const codes = Object.keys(responses || {});
    for (const code of ['200', '201', 'default', ...codes]) {
      const r = responses[code];
      if (r && r.content && r.content['application/json'] && r.content['application/json'].schema) {
        responseSchema = r.content['application/json'].schema;
        break;
      }
    }

    manifest.push({
      operationId,
      method: method.toUpperCase(),
      path: p,
      pathTemplate: p,
      parameters,
      requestBody: requestSchema,
      responseSchema
    });
  }
}

const outPath = path.resolve(process.cwd(), 'sdk-tests', 'manifest.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(
  outPath,
  JSON.stringify({ generatedAt: new Date().toISOString(), count: manifest.length, tests: manifest }, null, 2)
);

console.log('Wrote manifest with', manifest.length, 'tests to', outPath);
