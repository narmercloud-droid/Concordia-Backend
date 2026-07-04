#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const fetch = require('node-fetch');

const manifestPath = path.resolve(process.cwd(), 'sdk-tests', 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('Manifest not found. Run `npm run sdk:manifest` first.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const ajv = new Ajv({ strict: false });
const smokeOnly = process.env.SDK_TEST_SMOKE === '1';
const sdks =
  process.env.SDK_SKIP_PYTHON === '1' ? ['typescript'] : ['typescript', 'python'];
const results = [];
const baseUrl = process.env.SDK_TEST_BASEURL || 'http://127.0.0.1:4000';
// load full OpenAPI spec for $ref resolution
let openapiDoc = null;
try {
  const yaml = require('js-yaml');
  const openapiRaw = fs.readFileSync(path.resolve(process.cwd(), 'docs', 'openapi', 'openapi.yaml'), 'utf8');
  openapiDoc = yaml.load(openapiRaw);
} catch (e) {
  // ignore
}

const SwaggerParser = require('@apidevtools/swagger-parser');

function pickPayloadForValidation(body, schema) {
  if (body == null || !schema) return body;
  if (schema.type === 'array' && !Array.isArray(body) && body && typeof body === 'object') {
    for (const key of ['data', 'items', 'orders', 'branches', 'categories', 'menus', 'campaigns']) {
      if (Array.isArray(body[key])) return body[key];
    }
  }
  if (
    schema.type === 'object' &&
    body &&
    typeof body === 'object' &&
    body.data &&
    typeof body.data === 'object' &&
    !Array.isArray(body.data)
  ) {
    return body.data;
  }
  return body;
}

function generateRequestBody(schema) {
  if (!schema) return null;
  // handle requestBody wrapper with content
  if (schema.content && schema.content['application/json'] && schema.content['application/json'].schema) {
    schema = schema.content['application/json'].schema;
  }
  // resolve $ref
  let s = resolveSchemaRefs(schema) || schema;
  // oneOf / anyOf -> pick first
  if (s.oneOf && Array.isArray(s.oneOf) && s.oneOf.length) return generateRequestBody(s.oneOf[0]);
  if (s.anyOf && Array.isArray(s.anyOf) && s.anyOf.length) return generateRequestBody(s.anyOf[0]);
  // allOf -> merge shallowly
  if (s.allOf && Array.isArray(s.allOf) && s.allOf.length) {
    const merged = { type: 'object', properties: {}, required: [] };
    for (const part of s.allOf) {
      const r = resolveSchemaRefs(part) || part;
      if (r.properties) Object.assign(merged.properties, r.properties);
      if (Array.isArray(r.required)) merged.required.push(...r.required);
    }
    merged.required = Array.from(new Set(merged.required));
    return generateRequestBody(merged);
  }
  // nullable: still generate a value
  if (s.nullable) {
    // ignore nullable, generate non-null value
  }
  // enums
  if (s.enum && Array.isArray(s.enum) && s.enum.length) return s.enum[0];
  const type = s.type || (s.properties ? 'object' : undefined);
  if (!type) return 'example';
  if (type === 'string') {
    const fmt = (s.format || '').toLowerCase();
    if (fmt === 'email') return 'example@example.com';
    if (fmt === 'uuid') return '00000000-0000-4000-8000-000000000000';
    if (fmt === 'date-time') return new Date().toISOString();
    if (fmt === 'date') return new Date().toISOString().split('T')[0];
    if (fmt === 'uri' || fmt === 'url') return 'https://example.com';
    return 'example';
  }
  if (type === 'integer' || type === 'number') return 1;
  if (type === 'boolean') return true;
  if (type === 'array') {
    const items = s.items || {};
    return [generateRequestBody(items)];
  }
  if (type === 'object') {
    const obj = {};
    const props = s.properties || {};
    const required = Array.isArray(s.required) ? s.required : [];
    // ensure required props are present, but also populate optional props with examples
    for (const [k, v] of Object.entries(props)) {
      // generate value for each property (required or optional)
      obj[k] = generateRequestBody(v || {});
    }
    // If required properties reference names not present in properties, add placeholders
    for (const r of required) {
      if (!(r in obj)) obj[r] = 'example';
    }
    return obj;
  }
  return null;
}

function genValueFor(name, schema) {
  if (!schema) {
    if (name && /order/i.test(name)) return 'ord_123';
    if (name && /user|usr/i.test(name)) return 'usr_456';
    if (name && /id$/i.test(name)) return '1';
    return 'val_1';
  }
  const t = schema.type || (schema.properties ? 'object' : 'string');
  if (t === 'string') {
    if ((schema.format || '').toLowerCase() === 'uuid') return '00000000-0000-4000-8000-000000000000';
    if (name && /order/i.test(name)) return 'ord_123';
    if (name && /user|usr/i.test(name)) return 'usr_456';
    return 'str_1';
  }
  if (t === 'integer' || t === 'number') return 1;
  if (t === 'boolean') return true;
  if (t === 'object') {
    const obj = {};
    const props = schema.properties || {};
    for (const [k, v] of Object.entries(props)) obj[k] = genValueFor(k, v);
    return obj;
  }
  if (t === 'array') {
    const items = schema.items || {};
    return [genValueFor(name, items)];
  }
  return null;
}

function buildParams(entry) {
  const params = { path: {}, query: {}, headers: {}, body: null };
  // parameters (generate path/query/header params)
  (entry.parameters || []).forEach(p => {
    const nm = (p.name || '').toLowerCase();
    let v = null;
    // path params
    if (p.in === 'path') {
      if (nm.includes('orderid') || nm.includes('order')) v = 'ord_123';
      else if (nm.includes('branchid') || nm.includes('branch')) v = 'br_123';
      else if (nm.includes('addressid') || nm.includes('address')) v = 'addr_123';
      else if (nm.includes('userid') || nm.includes('user') || nm.includes('customer')) v = 'usr_123';
      else if (nm.includes('categoryid') || nm.includes('category')) v = 'cat_123';
      else if (nm.includes('variantid') || nm.includes('variant')) v = 'var_123';
      else if (nm.includes('menuid') || nm.includes('menu')) v = 'menu_123';
      else if (nm.includes('slotid') || nm.includes('slot')) v = 'slot_123';
      else v = 'id_123';
      params.path[p.name] = v;
    } else if (p.in === 'query') {
      // query params by type
      const t = (p.schema && p.schema.type) || 'string';
      if (p.schema && p.schema.enum && Array.isArray(p.schema.enum)) v = p.schema.enum[0];
      else if (t === 'string') v = 'example';
      else if (t === 'integer' || t === 'number') v = 1;
      else if (t === 'boolean') v = true;
      else v = 'example';
      params.query[p.name] = v;
    } else if (p.in === 'header') {
      // header params
      const t = (p.schema && p.schema.type) || 'string';
      if (p.schema && p.schema.enum && Array.isArray(p.schema.enum)) v = p.schema.enum[0];
      else if (t === 'string') v = 'example-header';
      else if (t === 'integer' || t === 'number') v = 1;
      else if (t === 'boolean') v = true;
      else v = 'example-header';
      params.headers[p.name] = v;
    }
  });

  // If no path params were discovered but the pathTemplate contains placeholders, generate them
  if (Object.keys(params.path).length === 0) {
    const tpl = (entry.pathTemplate || entry.path || '');
    const re = /\{([^}]+)\}/g;
    let m;
    while ((m = re.exec(tpl)) !== null) {
      const pname = m[1];
      const nm = (pname || '').toLowerCase();
      let v = 'id_123';
      if (nm.includes('orderid') || nm.includes('order')) v = 'ord_123';
      else if (nm.includes('branchid') || nm.includes('branch')) v = 'br_123';
      else if (nm.includes('addressid') || nm.includes('address')) v = 'addr_123';
      else if (nm.includes('userid') || nm.includes('user') || nm.includes('customer')) v = 'usr_123';
      else if (nm.includes('categoryid') || nm.includes('category')) v = 'cat_123';
      else if (nm.includes('variantid') || nm.includes('variant')) v = 'var_123';
      else if (nm.includes('menuid') || nm.includes('menu')) v = 'menu_123';
      else if (nm.includes('slotid') || nm.includes('slot')) v = 'slot_123';
      params.path[pname] = v;
    }
  }
  // request body (generate after path params)
  if (entry.requestBody) {
    try {
      params.body = generateRequestBody(entry.requestBody);
    } catch (e) {
      params.body = genValueFor('body', entry.requestBody);
    }
  }
  return params;
}

const adapters = {};
for (const sdk of sdks) {
  const adapterPath = path.resolve(process.cwd(), 'sdk-tests', 'adapters', `${sdk}.cjs`);
  try {
    adapters[sdk] = require(adapterPath);
  } catch (e) {
    console.warn('Adapter not found for', sdk, 'at', adapterPath, '- skipping adapter import.');
    adapters[sdk] = null;
  }
}

(async function run() {
  // attempt to dereference OpenAPI spec to resolve all $refs
  let derefSpec = null;
  try {
    const specPath = path.resolve(process.cwd(), 'docs', 'openapi', 'openapi.yaml');
    if (fs.existsSync(specPath)) {
      derefSpec = await SwaggerParser.dereference(specPath);
    } else if (openapiDoc) {
      derefSpec = await SwaggerParser.dereference(openapiDoc);
    }
    console.log('OpenAPI dereference', !!derefSpec);
    // register component schemas with Ajv for $ref resolution
    if (derefSpec && derefSpec.components && derefSpec.components.schemas) {
      for (const [name, schema] of Object.entries(derefSpec.components.schemas)) {
        try { ajv.addSchema(schema, `#/components/schemas/${name}`); } catch (e) { /* ignore */ }
      }
    }
  } catch (e) {
    derefSpec = null;
  }
  for (const sdk of sdks) {
    const adapter = adapters[sdk];
    for (const t of manifest.tests || []) {
      // skip parameter-only manifest entries generated for path-level parameter definitions
      if (t.method && t.method.toUpperCase && t.method.toUpperCase() === 'PARAMETERS') continue;
      const out = { sdk, operationId: t.operationId, method: t.method, path: t.path };
      try {
        const params = buildParams(t);

        // If dereferenced spec is available, ensure request body matches expected schema shape
        try {
          if (derefSpec && derefSpec.paths) {
            const pathKey = t.pathTemplate || t.path;
            const pathItem = derefSpec.paths[pathKey];
            if (pathItem) {
              const op = pathItem[(t.method||'get').toLowerCase()];
              if (op && op.requestBody && op.requestBody.content && op.requestBody.content['application/json']) {
                const reqSchema = op.requestBody.content['application/json'].schema || {};
                const expectsObject = reqSchema.type === 'object' || (reqSchema.properties && Object.keys(reqSchema.properties||{}).length>0);
                if (expectsObject && (params.body === null || Array.isArray(params.body) || typeof params.body !== 'object')) {
                  // generate minimal object from schema: include required props or at least an empty object
                  function genObjFromSchema(sch, depth=0) {
                    if (!sch || depth>6) return {};
                    if (sch.example !== undefined) return sch.example;
                    if (sch.enum && Array.isArray(sch.enum) && sch.enum.length) return sch.enum[0];
                    if (sch.type === 'object' || sch.properties) {
                      const out = {};
                      const props = sch.properties || {};
                      const required = Array.isArray(sch.required)? sch.required : [];
                      for (const k of required) {
                        out[k] = genObjFromSchema(props[k]||{}, depth+1) || 'example';
                      }
                      for (const [k,v] of Object.entries(props)) {
                        if (out[k]===undefined) out[k] = genObjFromSchema(v, depth+1);
                      }
                      return out;
                    }
                    if (sch.type === 'array') {
                      const it = sch.items || {};
                      return [genObjFromSchema(it, depth+1)];
                    }
                    // primitives
                    return genValueFor(propNameForSchema(sch) || 'val', sch);
                  }
                  function propNameForSchema(s) {
                    return s && s.title ? s.title : undefined;
                  }
                  try {
                    params.body = genObjFromSchema(reqSchema);
                  } catch (e) {
                    params.body = {};
                  }
                }
              }
            }
          }
        } catch (e) {
          // ignore
        }
        // substitute path params into path template
        let resolvedPath = t.pathTemplate || t.path || '';
        for (const [k, v] of Object.entries(params.path)) {
          resolvedPath = resolvedPath.replace(new RegExp(`{${k}}`, 'g'), encodeURIComponent(String(v)));
        }

        if (adapter && typeof adapter.invoke === 'function') {
          const resp = await adapter.invoke(t, { baseUrl, fetch, params, resolvedPath });
          out.statusCode = resp && resp.statusCode;
          out.body = resp && resp.body;
        } else {
          // fallback to direct HTTP call
          const url = baseUrl + resolvedPath.replace(/\{[^}]+\}/g, '1');
          const httpMethod = (t.method && t.method.toUpperCase && t.method.toUpperCase() === 'PARAMETERS') ? 'GET' : (t.method || 'GET');
          const opts = { method: httpMethod, headers: { 'accept': 'application/json', ...params.headers } };
          if (['POST', 'PUT', 'PATCH'].includes(t.method)) {
            opts.headers['content-type'] = 'application/json';
            if (typeof params.body === 'string') opts.body = params.body; else opts.body = JSON.stringify(params.body || {});
          }
          // append query params
          const qp = params.query && Object.keys(params.query).length ? ('?' + Object.entries(params.query).map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')) : '';
          const res = await fetch(url+qp, opts);
          let body = null;
          try { body = await res.json(); } catch (e) { body = await res.text().catch(()=>null); }
          out.statusCode = res.status;
          out.body = body;
        }

        if (smokeOnly) {
          out.ok = out.statusCode >= 200 && out.statusCode < 300;
          if (!out.ok) out.reason = `HTTP ${out.statusCode}`;
        } else if (t.responseSchema) {
          let schemaToValidate = t.responseSchema;
          try {
            if (derefSpec && derefSpec.paths) {
              const pathKey = t.pathTemplate || t.path;
              const pathItem = derefSpec.paths[pathKey];
              if (pathItem) {
                const op = pathItem[t.method.toLowerCase()];
                if (op && op.responses) {
                  const prefer = ['200','201','default'];
                  let found = null;
                  for (const k of prefer) {
                    if (op.responses[k] && op.responses[k].content && op.responses[k].content['application/json']) {
                      found = op.responses[k].content['application/json'].schema;
                      break;
                    }
                  }
                  if (!found) {
                    for (const code of Object.keys(op.responses || {})) {
                      const r = op.responses[code];
                      if (r && r.content && r.content['application/json']) { found = r.content['application/json'].schema; break; }
                    }
                  }
                  if (found) schemaToValidate = found;
                }
              }
            }
          } catch (e) {
            // ignore and use manifest schema
          }
          const validate = ajv.compile(schemaToValidate);
          const payload = pickPayloadForValidation(out.body, schemaToValidate);
          const ok = validate(payload);
          out.ok = !!ok;
          if (!ok) out.reason = validate.errors && JSON.stringify(validate.errors);
        } else {
          out.ok = out.statusCode >= 200 && out.statusCode < 300;
          if (!out.ok) out.reason = `HTTP ${out.statusCode}`;
        }
      } catch (err) {
        out.ok = false;
        out.reason = err && err.message;
      }
      results.push(out);
      console.log(`[${sdk}] ${t.operationId} -> ${out.ok ? 'PASS' : 'FAIL'}`, out.reason || '');
    }
  }

  // write report using reporter
  const reporter = require(path.resolve(process.cwd(), 'sdk-tests', 'report.cjs'));
  const report = reporter.generate(results, path.resolve(process.cwd(), 'sdk-tests', 'report.json'));
  console.log('Wrote report to', path.resolve(process.cwd(), 'sdk-tests', 'report.json'));
  console.log('Summary:', report.summary);
  const failed = report && report.summary && report.summary.failed ? report.summary.failed : 0;
  process.exit(failed>0?1:0);
})();
