const fs = require('fs');
const path = require('path');
const inFile = path.join(process.cwd(), 'docs', 'openapi', 'endpoints.csv');
const txt = fs.readFileSync(inFile, 'utf8');
const lines = txt.split(/\r?\n/).filter(Boolean).slice(1);
let ambiguous = 0;
const examples = [];
for (const line of lines) {
  const m = line.match(/^"([\s\S]*?)","([\s\S]*?)","([\s\S]*?)","([\s\S]*?)","([\s\S]*?)"$/);
  if (!m) continue;
  const p = m[2].toLowerCase();
  const mm = m[3].toLowerCase();
  const f = m[5].toLowerCase();
  const h = m[4].toLowerCase();
  const matched = [];
  if (p.includes('webhook') || f.includes('webhook') || p.includes('stripe') || p.includes('paypal') || h.includes('webhook')) matched.push('webhook');
  if (mm.includes('admin') || f.includes(path.sep + 'admin' + path.sep) || f.includes('/admin/')) matched.push('admin-internal');
  if (f.includes(path.sep + 'terminal') || p.includes('/terminals') || mm.includes('terminal') || mm.includes('terminalauth') || mm.includes('validateterminal')) matched.push('terminal');
  if (f.includes('printer') || p.includes('print') || f.includes('sunmi') || f.includes('printer')) matched.push('printer');
  if (f.includes(path.sep + 'kds') || mm.includes('kds')) matched.push('kds');
  if (f.includes(path.sep + 'analytics') || p.includes('/analytics') || f.includes('analytics')) matched.push('analytics');
  if (f.includes('fraud') || p.includes('fraud')) matched.push('fraud');
  if (f.includes('loyalty') || p.includes('loyalty')) matched.push('loyalty');
  if (f.includes('intelligence') || f.includes('decisionengine') || f.includes('knowledgegraph') || p.includes('intelligence')) matched.push('intelligence');
  if (mm.includes('driver') || f.includes(path.sep + 'driver') || f.includes(path.sep + 'courier') || p.includes('/courier') || p.includes('/driver') || mm.includes('courier') || mm.includes('driverauth')) matched.push('driver');
  if (mm.includes('customer') || f.includes(path.sep + 'customer') || f.includes(path.sep + 'customers') || f.includes(path.sep + 'public') || p.startsWith('/track') || p.startsWith('/menu') || p.startsWith('/search') || p.startsWith('/addresses') || p.startsWith('/register') || p.startsWith('/login') || p.startsWith('/me')) matched.push('public');
  const uniq = [...new Set(matched)];
  if (uniq.length > 1) {
    ambiguous++;
    if (examples.length < 20) examples.push({ matches: uniq, line });
  }
}
console.log('ambiguous_count=' + ambiguous);
if (examples.length) {
  console.log('examples:');
  examples.forEach(e => console.log(e.matches, e.line));
}
