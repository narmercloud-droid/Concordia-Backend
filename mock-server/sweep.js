const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const SwaggerParser = require('@apidevtools/swagger-parser');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const SPEC_PATH = path.join(__dirname, '..', 'docs', 'openapi', 'openapi.yaml');
const BASE = process.env.BASE_URL || 'http://localhost:4000';

function pickSuccessResponse(responses) {
  const prefer = ['200','201','202','204','default'];
  for (const p of prefer) if (responses[p]) return p;
  const codes = Object.keys(responses);
  return codes.length ? codes[0] : null;
}

function hasExampleForResponse(resp) {
  if (!resp || !resp.content || !resp.content['application/json']) return false;
  const media = resp.content['application/json'];
  if (media.example) return true;
  if (media.examples && Object.keys(media.examples).length) return true;
  return false;
}

function generateSampleFromSchema(schema) {
  if (!schema) return {};
  if (schema.example !== undefined) return schema.example;
  if (schema.type === 'object' || (schema.properties)) {
    const out = {};
    const props = schema.properties || {};
    for (const [k, v] of Object.entries(props)) {
      if (v.example !== undefined) out[k] = v.example;
      else if (v.type === 'string') out[k] = v.format === 'date-time' ? new Date().toISOString() : 'string';
      else if (v.type === 'integer' || v.type === 'number') out[k] = 1;
      else if (v.type === 'boolean') out[k] = false;
      else if (v.type === 'array') out[k] = [generateSampleFromSchema(v.items || {})];
      else if (v.type === 'object') out[k] = generateSampleFromSchema(v);
      else out[k] = null;
    }
    return out;
  }
  if (schema.type === 'array') return [generateSampleFromSchema(schema.items || {})];
  if (schema.type === 'string') return 'string';
  if (schema.type === 'integer' || schema.type === 'number') return 1;
  if (schema.type === 'boolean') return false;
  return {};
}

(async () => {
  const content = fs.readFileSync(SPEC_PATH, 'utf8');
  const doc = YAML.load(content);
  const api = await SwaggerParser.dereference(doc);

  const ajv = new Ajv({ allErrors: true, strict: false, coerceTypes: true });
  addFormats(ajv);

  const report = [];

  for (const rawPath of Object.keys(api.paths)) {
    const pathItem = api.paths[rawPath];
    for (const methodKey of Object.keys(pathItem)) {
      const method = methodKey.toLowerCase();
      if (!['get','post','put','patch','delete','options','head'].includes(method)) continue;
      const operation = pathItem[methodKey];
      const operationId = operation.operationId || `${method.toUpperCase()} ${rawPath}`;

      // build URL
      let url = BASE + rawPath.replace(/\{([^}]+)\}/g, (_, name) => {
        // try to find parameter to decide sample
        const p = (operation.parameters || []).find(x => x.name === name) ||
                  (pathItem.parameters || []).find(x => x.name === name) || {};
        const t = p.schema && p.schema.type ? p.schema.type : 'string';
        return t === 'integer' || t === 'number' ? '1' : 'test';
      });

      // Query params: skip (min valid input)

      // Request body
      let body = undefined;
      if (operation.requestBody && operation.requestBody.content && operation.requestBody.content['application/json']) {
        const schema = operation.requestBody.content['application/json'].schema || {};
        body = generateSampleFromSchema(schema);
      }

      // Send request
      let resObj = { status: 'Error', details: [], httpStatus: null };
      try {
        const opts = { method: method.toUpperCase(), headers: { 'Accept': 'application/json' } };
        if (body !== undefined) {
          opts.headers['Content-Type'] = 'application/json';
          opts.body = JSON.stringify(body);
        }
        const resp = await fetch(url, opts);
        const text = await resp.text();
        let json = null;
        try { json = text ? JSON.parse(text) : null; } catch (e) { json = text; }
        resObj.httpStatus = resp.status;

        // pick response schema from spec for this status
        const responses = operation.responses || {};
        const respCode = String(resp.status);
        const chosenCode = responses[respCode] ? respCode : pickSuccessResponse(responses);
        const respDef = chosenCode ? responses[chosenCode] : null;
        const media = respDef && respDef.content && respDef.content['application/json'] ? respDef.content['application/json'] : null;
        const schema = media && media.schema ? media.schema : null;

        const entry = { operationId, method: method.toUpperCase(), path: rawPath, url, status: 'OK', httpStatus: resp.status, notes: [], problems: [] };

        // missing example
        if (!hasExampleForResponse(respDef)) {
          entry.notes.push('missing_example');
        }

        if (schema && typeof json !== 'string') {
          const validate = ajv.compile(schema);
          const valid = validate(json);
          if (!valid) {
            entry.status = 'Error';
            entry.problems.push(...(validate.errors || []).map(e => ({ keyword: e.keyword, message: e.message, instancePath: e.instancePath, params: e.params })));
          }
          // extra checks: unexpected fields
          if (schema.type === 'object' && schema.properties && json && typeof json === 'object' && !Array.isArray(json)) {
            const extra = Object.keys(json).filter(k => !Object.prototype.hasOwnProperty.call(schema.properties, k));
            if (extra.length) entry.problems.push({ keyword: 'additionalProperties', message: `unexpected fields: ${extra.join(', ')}`, fields: extra });
          }
          // nullability: if schema type doesn't include null but value is null
          function checkNullViolations(sch, val, pathStr='') {
            if (val === null) {
              const allowsNull = (sch.type && Array.isArray(sch.type) && sch.type.includes('null')) || sch.nullable === true;
              if (!allowsNull) entry.problems.push({ keyword: 'null', message: `nullability violation at ${pathStr}` });
            }
            if (sch.type === 'object' && sch.properties && val && typeof val === 'object') {
              for (const k of Object.keys(sch.properties)) {
                checkNullViolations(sch.properties[k], val[k], pathStr ? `${pathStr}.${k}` : k);
              }
            }
            if (sch.type === 'array' && Array.isArray(val)) {
              for (let i=0;i<val.length;i++) checkNullViolations(sch.items || {}, val[i], `${pathStr}[${i}]`);
            }
          }
          checkNullViolations(schema, json);

          // missing required fields - Ajv reports these
          if (entry.problems.length && entry.status !== 'Error') entry.status = 'Warning';
        } else if (!schema) {
          entry.notes.push('no_response_schema');
          entry.status = 'Warning';
        }

        report.push(entry);
      } catch (e) {
        report.push({ operationId, method: method.toUpperCase(), path: rawPath, url, status: 'Error', error: String(e) });
      }
    }
  }

  const outPath = path.join(__dirname, 'sweep-report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log('Sweep complete. Report written to', outPath);
  // also print a short summary
  const summary = { total: report.length, ok: report.filter(r=>r.status==='OK').length, warn: report.filter(r=>r.status==='Warning').length, err: report.filter(r=>r.status==='Error').length };
  console.log('Summary:', summary);
})();
