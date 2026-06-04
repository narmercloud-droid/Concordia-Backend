const fs = require('fs');
const path = require('path');

const inFile = path.join(process.cwd(), 'docs', 'openapi', 'endpoints-classified.csv');
const outFile = path.join(process.cwd(), 'docs', 'openapi', '_public_paths.yaml');
if (!fs.existsSync(inFile)) { console.error('input missing', inFile); process.exit(1); }
const txt = fs.readFileSync(inFile, 'utf8');
const lines = txt.split(/\r?\n/).filter(Boolean).slice(1);

function parse(line) {
  const m = line.match(/^"([^"]*?)","([^"]*?)","([^"]*?)","([^"]*?)","([^"]*?)","([^"]*?)"$/);
  if (!m) return null;
  return { method: m[1], path: m[2], middlewares: m[3], handler: m[4], file: m[5], visibility: m[6] };
}

function chooseTag(p, h) {
  const s = (p + ' ' + h).toLowerCase();
  if (s.includes('auth') || s.includes('login') || s.includes('register') || s.includes('magic') || s.includes('otp')) return 'Auth';
  if (s.includes('order') || s.includes('checkout') || s.includes('cart') || s.includes('payment')) return 'Orders';
  if (s.includes('menu') || s.includes('category') || s.includes('item') || s.includes('variant')) return 'Menu';
  if (s.includes('offer') || s.includes('promo') || s.includes('voucher')) return 'Offers';
  if (s.includes('metrics') || s.includes('prometheus')) return 'Metrics';
  return 'Public';
}

const entries = new Map();
for (const L of lines) {
  const r = parse(L);
  if (!r) continue;
  if (r.visibility !== 'public') continue;
  const key = r.path;
  const method = r.method.toLowerCase();
  if (!entries.has(key)) entries.set(key, {});
  entries.get(key)[method] = r;
}

let out = '';
for (const entry of entries.entries()) {
  const p = entry[0];
  const methods = entry[1];
  out += '  ' + p + ':\n';
  for (const m of Object.keys(methods)) {
    const r = methods[m];
    const tag = chooseTag(p, r.handler);
    const hasBody = ['post','put','patch'].includes(m);
    out += '    ' + m + ':\n';
    out += '      summary: Auto-generated placeholder for ' + m.toUpperCase() + ' ' + p + '\n';
    out += '      description: Placeholder path added from endpoint scan. Fill request/response schemas.\n';
    out += '      tags: [' + tag + ']\n';
    if (hasBody) {
      out += '      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              $ref: "#/components/schemas/GenericRequest"\n';
    }
    out += '      responses:\n        \"200\":\n          description: Successful response\n          content:\n            application/json:\n              schema:\n                $ref: "#/components/schemas/GenericResponse"\n';
    out += '        \"400\":\n          $ref: "#/components/responses/BadRequest"\n';
    out += '        \"401\":\n          $ref: "#/components/responses/Unauthorized"\n';
    out += '        \"403\":\n          $ref: "#/components/responses/Forbidden"\n';
    out += '        \"404\":\n          $ref: "#/components/responses/NotFound"\n';
    out += '        \"500\":\n          $ref: "#/components/responses/InternalError"\n';
  }
}

out += '\n# Placeholder schemas for auto-generated public endpoints\n';
out += 'components:\n  schemas:\n    GenericRequest:\n      type: object\n      description: Placeholder request schema - replace with concrete schema.\n    GenericResponse:\n      type: object\n      description: Placeholder response schema - replace with concrete schema.\n';

fs.writeFileSync(outFile, out, 'utf8');
console.log('Wrote', outFile, 'with', entries.size, 'paths');
