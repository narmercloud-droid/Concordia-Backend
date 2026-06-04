const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
// No external dereferencer to avoid extra deps; we'll resolve local $ref paths manually.


const ROOT = path.join(__dirname, '..');
const SPEC_PATH = path.join(ROOT, 'docs', 'openapi', 'openapi.yaml');
const REPORT_PATH = path.join(ROOT, 'mock-server', 'sweep-report.json');

function sampleFromSchema(schema) {
  if (!schema) return null;
  if (schema.example !== undefined) return schema.example;
  if (schema.const !== undefined) return schema.const;
  if (schema.enum) return schema.enum[0];
  if (schema.oneOf || schema.anyOf) {
    const list = schema.oneOf || schema.anyOf;
    return sampleFromSchema(list[0]);
  }
  if (schema.type === 'object' || schema.properties) {
    const out = {};
    const props = schema.properties || {};
    for (const [k, v] of Object.entries(props)) {
      out[k] = sampleFromSchema(v) !== null ? sampleFromSchema(v) : (v && v.type === 'array' ? [] : null);
      if (out[k] === null) {
        if (v && v.type === 'string') out[k] = 'string';
        else if (v && (v.type === 'integer' || v.type === 'number')) out[k] = 1;
        else if (v && v.type === 'boolean') out[k] = false;
        else if (v && v.type === 'array') out[k] = [];
        else out[k] = null;
      }
    }
    return out;
  }
  if (schema.type === 'array') return [sampleFromSchema(schema.items || {})];
  if (schema.type === 'string') {
    if (schema.format === 'date-time') return new Date().toISOString();
    return schema.example || 'string';
  }
  if (schema.type === 'integer' || schema.type === 'number') return 1;
  if (schema.type === 'boolean') return false;
  if (schema.type === 'null') return null;
  return null;
}

(async function(){
  const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
  const toAdd = {};
  for (const entry of report) {
    const hasMissing = entry.notes && entry.notes.includes('missing_example');
    const noSchema = entry.notes && entry.notes.includes('no_response_schema');
    if (hasMissing || noSchema) {
      toAdd[entry.path] = toAdd[entry.path] || {};
      toAdd[entry.path][entry.method.toLowerCase()] = { missing: hasMissing, noSchema };
    }
  }

  if (Object.keys(toAdd).length === 0) {
    console.log('No operations require updates.');
    return;
  }

  const raw = fs.readFileSync(SPEC_PATH, 'utf8');
  const doc = YAML.load(raw);

  function resolveRef(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (obj.$ref && typeof obj.$ref === 'string' && obj.$ref.startsWith('#/')) {
      const parts = obj.$ref.slice(2).split('/');
      let cur = doc;
      for (const p of parts) {
        if (cur === undefined) break;
        cur = cur[p];
      }
      return cur;
    }
    return obj;
  }

  function resolveRefs(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (obj.$ref) return resolveRefs(resolveRef(obj));
    if (Array.isArray(obj)) return obj.map(resolveRefs);
    const out = {};
    for (const k of Object.keys(obj)) {
      out[k] = resolveRefs(obj[k]);
    }
    return out;
  }

  for (const rawPath of Object.keys(toAdd)) {
    const pathItem = doc.paths[rawPath];
    const derefPathItem = doc.paths[rawPath];
    for (const method of Object.keys(toAdd[rawPath])) {
      const op = pathItem[method];
      const derefOp = derefPathItem[method];
      if (!op) continue;

      // Determine preferred success response code
      const responses = op.responses || {};
      const prefer = ['200','201','202','204','default'];
      let chosen = null;
      for (const p of prefer) if (responses[p]) { chosen = p; break; }
      if (!chosen) chosen = Object.keys(responses)[0];
      if (!chosen) continue;

      const media = responses[chosen].content && responses[chosen].content['application/json'];
      if (toAdd[rawPath][method].noSchema) {
        // add simple schema
        responses[chosen].content = responses[chosen].content || {};
        responses[chosen].content['application/json'] = responses[chosen].content['application/json'] || {};
        responses[chosen].content['application/json'].schema = { type: 'object', additionalProperties: true };
        responses[chosen].content['application/json'].example = { status: 'ok' };
        console.log(`Added simple schema+example for ${method.toUpperCase()} ${rawPath} (${chosen})`);
        continue;
      }

      // missing example: generate from derefOp response schema if possible
      const derefResponses = derefOp.responses || {};
      const chosenDeref = derefResponses[chosen] || derefResponses[Object.keys(derefResponses)[0]];
      const mediaDeref = chosenDeref && chosenDeref.content && chosenDeref.content['application/json'];
      let schema = mediaDeref && mediaDeref.schema ? mediaDeref.schema : null;
      if (schema) schema = resolveRefs(schema);
      if (!schema) {
        // fallback: if response content present in original but no schema, skip
        if (media && media.schema) schema = media.schema; else {
          // nothing to base example on
          responses[chosen].content = responses[chosen].content || {};
          responses[chosen].content['application/json'] = responses[chosen].content['application/json'] || {};
          responses[chosen].content['application/json'].example = { status: 'ok' };
          console.log(`Added generic example for ${method.toUpperCase()} ${rawPath} (${chosen})`);
          continue;
        }
      }

      const example = sampleFromSchema(schema) || { status: 'ok' };
      responses[chosen].content = responses[chosen].content || {};
      responses[chosen].content['application/json'] = responses[chosen].content['application/json'] || {};
      responses[chosen].content['application/json'].example = example;
      console.log(`Added example for ${method.toUpperCase()} ${rawPath} (${chosen})`);
    }
  }

  // write back YAML
  const out = YAML.dump(doc, { lineWidth: 120 });
  fs.writeFileSync(SPEC_PATH, out, 'utf8');
  console.log('Wrote updates to', SPEC_PATH);
})();
