const fs = require('fs');
const path = require('path');

const inFile = path.join(process.cwd(), 'docs', 'openapi', 'endpoints.csv');
const outFile = path.join(process.cwd(), 'docs', 'openapi', 'endpoints-classified.csv');
if (!fs.existsSync(inFile)) {
  console.error('Input not found:', inFile);
  process.exit(1);
}
const txt = fs.readFileSync(inFile, 'utf8');
const lines = txt.split(/\r?\n/).filter(Boolean);
const header = lines[0];
const rows = lines.slice(1);

function parseRow(line) {
  // Expect CSV with 5 quoted fields
  const m = line.match(/^"([\s\S]*?)","([\s\S]*?)","([\s\S]*?)","([\s\S]*?)","([\s\S]*?)"$/);
  if (!m) return null;
  return { method: m[1], path: m[2], middlewares: m[3], handler: m[4], file: m[5], raw: line };
}

function classify(r) {
  const p = (r.path || '').toLowerCase();
  const f = (r.file || '').toLowerCase();
  const m = (r.middlewares || '').toLowerCase();
  const h = (r.handler || '').toLowerCase();

  const tags = [];

  if (p.includes('webhook') || f.includes('webhook') || p.includes('stripe') || p.includes('paypal') || h.includes('webhook') ) tags.push('webhook');
  if (m.includes('admin') || f.includes(path.sep + 'admin' + path.sep) || f.includes('/admin/')) tags.push('admin-internal');
  if (f.includes(path.sep + 'terminal') || p.includes('/terminals') || m.includes('terminal') || m.includes('terminalauth') || m.includes('validateterminal')) tags.push('terminal');
  if (f.includes('printer') || p.includes('print') || f.includes('sunmi') || f.includes('printer')) tags.push('printer');
  if (f.includes(path.sep + 'kds') || m.includes('kds')) tags.push('kds');
  if (f.includes(path.sep + 'analytics') || p.includes('/analytics') || f.includes('analytics')) tags.push('analytics');
  if (f.includes('fraud') || p.includes('fraud')) tags.push('fraud');
  if (f.includes('loyalty') || p.includes('loyalty')) tags.push('loyalty');
  if (f.includes('intelligence') || f.includes('decisionengine') || f.includes('knowledgegraph') || p.includes('intelligence')) tags.push('intelligence');
  if (m.includes('driver') || f.includes(path.sep + 'driver') || f.includes(path.sep + 'courier') || p.includes('/courier') || p.includes('/driver') || m.includes('courier') || m.includes('driverauth')) tags.push('driver');
  // public: customer/front-end
  if (m.includes('customer') || f.includes(path.sep + 'customer') || f.includes(path.sep + 'customers') || f.includes(path.sep + 'public') || p.startsWith('/track') || p.startsWith('/menu') || p.startsWith('/search') || p.startsWith('/addresses') || p.startsWith('/addresses') || p.startsWith('/register') || p.startsWith('/login') || p.startsWith('/me') ) tags.push('public');

  // resolve priority
  const priority = ['webhook','terminal','printer','kds','admin-internal','driver','analytics','fraud','loyalty','intelligence','public'];
  for (const t of priority) if (tags.includes(t)) return t;
  // default
  return 'internal';
}

const outLines = [];
outLines.push(header + ',visibility');
const counts = {};
const ambiguous = [];

for (const line of rows) {
  const r = parseRow(line);
  if (!r) continue;
  // detect multiple categories
  const p = (r.path || '').toLowerCase();
  const f = (r.file || '').toLowerCase();
  const m = (r.middlewares || '').toLowerCase();
  const h = (r.handler || '').toLowerCase();
  const matched = [];
  if (p.includes('webhook') || f.includes('webhook') || p.includes('stripe') || p.includes('paypal') || h.includes('webhook')) matched.push('webhook');
  if (m.includes('admin') || f.includes(path.sep + 'admin' + path.sep) || f.includes('/admin/')) matched.push('admin-internal');
  if (f.includes(path.sep + 'terminal') || p.includes('/terminals') || m.includes('terminal') || m.includes('terminalauth') || m.includes('validateterminal')) matched.push('terminal');
  if (f.includes('printer') || p.includes('print') || f.includes('sunmi') || f.includes('printer')) matched.push('printer');
  if (f.includes(path.sep + 'kds') || m.includes('kds')) matched.push('kds');
  if (f.includes(path.sep + 'analytics') || p.includes('/analytics') || f.includes('analytics')) matched.push('analytics');
  if (f.includes('fraud') || p.includes('fraud')) matched.push('fraud');
  if (f.includes('loyalty') || p.includes('loyalty')) matched.push('loyalty');
  if (f.includes('intelligence') || f.includes('decisionengine') || f.includes('knowledgegraph') || p.includes('intelligence')) matched.push('intelligence');
  if (m.includes('driver') || f.includes(path.sep + 'driver') || f.includes(path.sep + 'courier') || p.includes('/courier') || p.includes('/driver') || m.includes('courier') || m.includes('driverauth')) matched.push('driver');
  if (m.includes('customer') || f.includes(path.sep + 'customer') || f.includes(path.sep + 'customers') || f.includes(path.sep + 'public') || p.startsWith('/track') || p.startsWith('/menu') || p.startsWith('/search') || p.startsWith('/addresses') || p.startsWith('/register') || p.startsWith('/login') || p.startsWith('/me')) matched.push('public');

  const unique = [...new Set(matched)];
  let vis = 'internal';
  if (unique.length === 0) vis = 'internal';
  else if (unique.length === 1) vis = unique[0];
  else {
    // multiple matches; pick by priority
    const priority = ['webhook','terminal','printer','kds','admin-internal','driver','analytics','fraud','loyalty','intelligence','public'];
    for (const t of priority) if (unique.includes(t)) { vis = t; break; }
    ambiguous.push({ row: line, matches: unique, chosen: vis });
  }
  counts[vis] = (counts[vis] || 0) + 1;
  outLines.push(line + ',"' + vis + '"');
}

fs.writeFileSync(outFile, outLines.join('\r\n'));

console.log('Wrote', outFile);
console.log('Counts:');
Object.keys(counts).sort().forEach(k => console.log(k, counts[k]));
if (ambiguous.length) {
  console.log('\nAmbiguous examples (first 20):');
  ambiguous.slice(0,20).forEach(a => console.log(a.chosen, a.matches, a.row));
}
