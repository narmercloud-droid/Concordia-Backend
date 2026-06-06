const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const YAML = require('js-yaml');
const SwaggerParser = require('@apidevtools/swagger-parser');
// custom deterministic generator will be used instead of json-schema-faker
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const SPEC_PATH = path.join(__dirname, '..', 'docs', 'openapi', 'openapi.yaml');
const PORT = process.env.PORT || 4000;

async function loadSpec() {
  const content = fs.readFileSync(SPEC_PATH, 'utf8');
  const doc = YAML.load(content);
  const api = await SwaggerParser.dereference(doc);
  return api;
}

function pickResponseSchema(operation) {
  const responses = operation.responses || {};
  // Prefer 200, 201, default
  const prefer = ['200','201','default'];
  for (const k of prefer) {
    if (responses[k] && responses[k].content && responses[k].content['application/json']) {
      return responses[k].content['application/json'].schema;
    }
  }
  // fallback to first json response
  for (const code of Object.keys(responses)) {
    const r = responses[code];
    if (r && r.content && r.content['application/json']) return r.content['application/json'].schema;
  }
  return null;
}

function getExampleFromResponse(operation) {
  const responses = operation.responses || {};
  for (const code of Object.keys(responses)) {
    const r = responses[code];
    if (r && r.content && r.content['application/json']) {
      const media = r.content['application/json'];
      if (media.example) return media.example;
      if (media.examples) {
        const exKey = Object.keys(media.examples)[0];
        if (media.examples[exKey] && media.examples[exKey].value) return media.examples[exKey].value;
      }
    }
  }
  return null;
}

async function createServer() {
  const api = await loadSpec();
  const app = express();
  app.use(morgan('dev'));
  app.use(express.json({ limit: '1mb' }));

  const ajv = new Ajv({ coerceTypes: true, strict: false });
  addFormats(ajv);

  // deterministic counter used for small variations
  let seedCounter = 1;

  function genPrimitiveByName(name, schema, counter) {
    const n = (counter % 1000);
    if (/orderid|orderId/i.test(name)) return `ord_${String(100 + (n % 900))}`;
    if (/userid|userId/i.test(name)) return `usr_${String(100 + (n % 900))}`;
    if (/branchid|branchId/i.test(name)) return `br_${String(100 + (n % 900))}`;
    if (schema && schema.enum && Array.isArray(schema.enum) && schema.enum.length) return schema.enum[0];
    if (schema && schema.format === 'email') return `user${n}@example.com`;
    if (schema && schema.format === 'date-time') return new Date(1600000000000 + n * 1000).toISOString();
    if (schema && schema.type === 'integer') return 1 + (n % 100);
    if (schema && schema.type === 'number') return 1.0 + (n % 100) / 10;
    if (schema && schema.type === 'boolean') return false;
    return `str_${String(n)}`;
  }

  function generateResponseFromSchema(schema, propName, depth = 0) {
    if (!schema || depth > 8) return null;
    // prefer explicit examples/enums
    if (schema.enum && Array.isArray(schema.enum) && schema.enum.length) return schema.enum[0];
    if (schema.example !== undefined) return schema.example;

    // combiners
    if (schema.oneOf && Array.isArray(schema.oneOf) && schema.oneOf.length) {
      return generateResponseFromSchema(schema.oneOf[0], propName, depth+1);
    }
    if (schema.anyOf && Array.isArray(schema.anyOf) && schema.anyOf.length) {
      return generateResponseFromSchema(schema.anyOf[0], propName, depth+1);
    }
    if (schema.allOf && Array.isArray(schema.allOf) && schema.allOf.length) {
      // merge object branches when possible
      const merged = { type: 'object', properties: {}, required: [] };
      for (const part of schema.allOf) {
        const p = part || {};
        if (p.properties) Object.assign(merged.properties, p.properties);
        if (Array.isArray(p.required)) merged.required.push(...p.required);
      }
      merged.required = Array.from(new Set(merged.required));
      return generateResponseFromSchema(merged, propName, depth+1);
    }

    const t = schema.type || (schema.properties ? 'object' : undefined);
    if (t === 'object') {
      const out = {};
      const props = schema.properties || {};
      const required = Array.isArray(schema.required) ? schema.required : [];
      // ensure required properties present first
      for (const k of required) {
        const ps = props[k] || {};
        out[k] = generateResponseFromSchema(ps, k, depth+1);
      }
      // then fill other properties
      for (const [k, v] of Object.entries(props)) {
        if (out[k] === undefined) out[k] = generateResponseFromSchema(v, k, depth+1);
      }
      return out;
    }

    if (t === 'array') {
      const itemsSchema = schema.items || {};
      const count = 1; // deterministic single item
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push(generateResponseFromSchema(itemsSchema, propName ? propName + '_item' : 'item', depth+1));
      }
      return arr;
    }

    // primitives and formats
    if (!t || t === 'string') {
      const fmt = (schema.format || '').toLowerCase();
      if (fmt === 'email') return 'example@example.com';
      if (fmt === 'uuid') return '00000000-0000-4000-8000-000000000000';
      if (fmt === 'date-time') return new Date().toISOString();
      if (fmt === 'date') return new Date().toISOString().split('T')[0];
      if (fmt === 'uri' || fmt === 'url') return 'https://example.com';
      return genPrimitiveByName(propName || '', schema, seedCounter++);
    }
    if (t === 'integer' || t === 'number') return 1;
    if (t === 'boolean') return true;
    return null;
  }

  // overrides
  const OVERRIDES_PATH = path.join(__dirname, 'overrides.json');
  let overrides = {};
  try {
    if (fs.existsSync(OVERRIDES_PATH)) {
      const raw = fs.readFileSync(OVERRIDES_PATH, 'utf8');
      overrides = JSON.parse(raw || '{}');
    }
  } catch (e) {
    console.warn('Failed to load overrides.json', e);
    overrides = {};
  }

  function deepMerge(target, src) {
    if (!src) return target;
    for (const k of Object.keys(src)) {
      if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) {
        target[k] = target[k] || {};
        deepMerge(target[k], src[k]);
      } else {
        target[k] = src[k];
      }
    }
    return target;
  }

  function saveOverrides() {
    try {
      fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(overrides, null, 2));
    } catch (e) {
      console.error('Failed to save overrides.json', e);
    }
  }

  // store handlers for simulation
  const webhookHandlers = {};

  const httpMethods = ['get','post','put','patch','delete','options','head'];
  for (const rawPath of Object.keys(api.paths)) {
    const pathItem = api.paths[rawPath];
    for (const methodKey of Object.keys(pathItem)) {
      const method = methodKey.toLowerCase();
      if (!httpMethods.includes(method)) continue;
      const operation = pathItem[methodKey];
      const expressPath = rawPath.replace(/{/g, ':').replace(/}/g, '');

      const respSchema = pickResponseSchema(operation);
      const example = getExampleFromResponse(operation);

      const handler = async (req, res) => {
        console.log(`--> ${method.toUpperCase()} ${rawPath}`);
        console.log('Headers:', req.headers);
        console.log('Query:', req.query);
        console.log('Params:', req.params);
        console.log('Body:', req.body);

        // Basic request validation for JSON body (log errors but still attempt to produce a schema-driven response)
        let requestValid = true;
        if (operation.requestBody && operation.requestBody.content && operation.requestBody.content['application/json']) {
          const schema = operation.requestBody.content['application/json'].schema;
          try {
            const validate = ajv.compile(schema);
            const valid = validate(req.body);
            if (!valid) {
              requestValid = false;
              console.warn('Request validation failed for', operation.operationId, validate.errors);
              // do NOT short-circuit; continue to generate a response that matches the response schema
            }
          } catch (e) {
            // ignore compile errors
          }
        }

        // check overrides first
        try {
          const methodKey = method.toUpperCase();
          const o = overrides[rawPath] && overrides[rawPath][methodKey];
          if (o) {
            if (o.delay) await new Promise(r => setTimeout(r, o.delay));
            // rate limit headers
            res.set('X-RateLimit-Limit', '1000');
            res.set('X-RateLimit-Remaining', '999');
            res.set('X-RateLimit-Reset', String(Math.floor(Date.now()/1000) + 3600));
            return res.status(o.status || 200).json(o.body === undefined ? {} : o.body);
          }
        } catch (e) {
          console.warn('Override handling error', e);
        }

        // produce response: prefer schema-driven generation to ensure strict fields
        let out;
        if (respSchema) {
          try {
            out = generateResponseFromSchema(respSchema, operation.operationId || 'response');
          } catch (e) {
            out = { note: 'mock-generation-failed', error: String(e) };
          }
        } else if (example) {
          out = example;
        } else {
          out = { message: 'no schema available' };
        }

        // response validation
        try {
          if (respSchema) {
            const validateOut = ajv.compile(respSchema);
            const ok = validateOut(out);
            if (!ok) {
              console.warn('Response validation failed', validateOut.errors, 'for', operation.operationId);
            }
          }
        } catch (e) {
          // ignore
        }

        // rate limit headers
        res.set('X-RateLimit-Limit', '1000');
        res.set('X-RateLimit-Remaining', '999');
        res.set('X-RateLimit-Reset', String(Math.floor(Date.now()/1000) + 3600));

        res.json(out);
      };

      // register route
      app[method](expressPath, handler);

      // if this is a webhook path, store handler for simulation
      if (rawPath.startsWith('/webhooks/')) {
        const eventName = rawPath.split('/').pop();
        webhookHandlers[eventName] = handler;
      }
    }
  }

  // simulate webhook endpoint
  app.post('/simulate/webhooks/:eventName', async (req, res) => {
    const { eventName } = req.params;
    const handler = webhookHandlers[eventName];
    if (!handler) return res.status(404).json({ error: 'NotFound', message: 'No such webhook event', code: 'WEBHOOK_NOT_FOUND' });

    // allow overriding payload
    const payload = req.body && Object.keys(req.body).length ? req.body : undefined;

    // call handler by constructing mock req/res
    const fakeReq = { headers: req.headers, query: {}, params: { }, body: payload || {} };
    const fakeRes = {
      headers: {},
      status(code) { this._status = code; return this; },
      set(k,v) { this.headers[k]=v; },
      json(obj) { this._body = obj; },
    };

    await handler(fakeReq, fakeRes);

    res.json({ result: 'simulated', event: eventName, response: fakeRes._body, status: fakeRes._status || 200 });
  });

  // health
  app.get('/__health', (req, res) => res.json({ ok: true }));

  // overrides management
  app.post('/__overrides', express.json(), (req, res) => {
    const newO = req.body || {};
    deepMerge(overrides, newO);
    saveOverrides();
    res.json(overrides);
  });

  app.delete('/__overrides', (req, res) => {
    overrides = {};
    saveOverrides();
    res.json(overrides);
  });

  return app.listen(PORT, () => console.log(`Concordia mock server running on http://localhost:${PORT}`));
}

if (require.main === module) {
  createServer().catch(err => {
    console.error('Failed to start mock server', err);
    process.exit(1);
  });
}
