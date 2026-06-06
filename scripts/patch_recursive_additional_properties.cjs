#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const SPEC_PATH = path.resolve(__dirname, '..', 'docs', 'openapi', 'openapi.yaml');

function loadSpec() {
  const src = fs.readFileSync(SPEC_PATH, 'utf8');
  return yaml.load(src);
}

let patchedCount = 0;

function walkSchema(schema, ctx) {
  if (!schema || typeof schema !== 'object') return;

  // If this schema declares properties (object shape) and additionalProperties is not defined
  if (schema.properties && schema.additionalProperties === undefined) {
    schema.additionalProperties = true;
    patchedCount++;
    // log minimal context
    if (ctx && ctx.location) console.log('Patched additionalProperties at', ctx.location);
  }

  // Recurse into properties
  if (schema.properties && typeof schema.properties === 'object') {
    for (const [k, v] of Object.entries(schema.properties)) walkSchema(v, { location: (ctx && ctx.location ? ctx.location + '.' : '') + 'properties.' + k });
  }

  // Arrays -> items
  if (schema.type === 'array' && schema.items) {
    walkSchema(schema.items, { location: (ctx && ctx.location ? ctx.location + '.' : '') + 'items' });
  }

  // items may be present even without explicit type
  if (schema.items && typeof schema.items === 'object') {
    walkSchema(schema.items, { location: (ctx && ctx.location ? ctx.location + '.' : '') + 'items' });
  }

  // oneOf / anyOf / allOf
  ['oneOf', 'anyOf', 'allOf'].forEach((comb) => {
    if (Array.isArray(schema[comb])) {
      schema[comb].forEach((s, idx) => walkSchema(s, { location: (ctx && ctx.location ? ctx.location + '.' : '') + comb + '[' + idx + ']' }));
    }
  });

  // additional nested schema containers: properties may contain $ref or inline, already handled
}

function walkPaths(doc) {
  if (!doc.paths) return;
  for (const [p, methods] of Object.entries(doc.paths)) {
    for (const [m, op] of Object.entries(methods)) {
      if (m.startsWith('x-')) continue;
      const locationBase = `paths.${p}.${m}`;

      // parameters
      if (Array.isArray(op.parameters)) {
        op.parameters.forEach((param, idx) => {
          if (param.schema) walkSchema(param.schema, { location: `${locationBase}.parameters[${idx}].schema` });
        });
      }

      // requestBody
      if (op.requestBody && op.requestBody.content) {
        for (const [media, mediaObj] of Object.entries(op.requestBody.content)) {
          if (mediaObj.schema) walkSchema(mediaObj.schema, { location: `${locationBase}.requestBody.content.${media}.schema` });
        }
      }

      // responses
      if (op.responses) {
        for (const [code, resp] of Object.entries(op.responses)) {
          if (!resp || !resp.content) continue;
          for (const [media, mediaObj] of Object.entries(resp.content)) {
            if (mediaObj.schema) walkSchema(mediaObj.schema, { location: `${locationBase}.responses.${code}.content.${media}.schema` });
          }
        }
      }
    }
  }
}

function main() {
  console.log('Loading spec from', SPEC_PATH);
  const doc = loadSpec();

  // Components.schemas
  if (doc.components && doc.components.schemas) {
    for (const [name, schema] of Object.entries(doc.components.schemas)) {
      walkSchema(schema, { location: `components.schemas.${name}` });
    }
  }

  // Walk paths for inline response/request schemas
  walkPaths(doc);

  // Write back
  const out = yaml.dump(doc, { noRefs: true, condenseFlow: false, lineWidth: 120 });
  fs.writeFileSync(SPEC_PATH, out, 'utf8');
  console.log(`Done. Patched ${patchedCount} schema locations.`);
}

main();
