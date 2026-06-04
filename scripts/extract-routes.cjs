const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (/\.(js|ts|mjs|jsx|tsx)$/.test(e.name)) files.push(full);
  }
  return files;
}

function findClosingParen(str, startIdx) {
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inBack = false;
  for (let i = startIdx; i < str.length; i++) {
    const ch = str[i];
    if (ch === "'" && !inDouble && !inBack) inSingle = !inSingle;
    else if (ch === '"' && !inSingle && !inBack) inDouble = !inDouble;
    else if (ch === '`' && !inSingle && !inDouble) inBack = !inBack;
    else if (!inSingle && !inDouble && !inBack) {
      if (ch === '(') depth++;
      else if (ch === ')') {
        if (depth === 0) return i;
        depth--;
      }
    }
  }
  return -1;
}

function splitTopLevelCommas(s) {
  const parts = [];
  let cur = '';
  let depth = 0;
  let inSingle = false, inDouble = false, inBack = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "'" && !inDouble && !inBack) { inSingle = !inSingle; cur += ch; continue; }
    if (ch === '"' && !inSingle && !inBack) { inDouble = !inDouble; cur += ch; continue; }
    if (ch === '`' && !inSingle && !inDouble) { inBack = !inBack; cur += ch; continue; }
    if (!inSingle && !inDouble && !inBack) {
      if (ch === '(' || ch === '[' || ch === '{') { depth++; cur += ch; continue; }
      if (ch === ')' || ch === ']' || ch === '}') { depth--; cur += ch; continue; }
      if (ch === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; continue; }
    }
    cur += ch;
  }
  if (cur.trim() !== '') parts.push(cur.trim());
  return parts;
}

function extractFromFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const results = [];
  const regex = /(?:\b|\s)(router|app)\.(get|post|put|patch|delete)\s*\(/g;
  let m;
  while ((m = regex.exec(src)) !== null) {
    const method = m[2].toUpperCase();
    const startIdx = m.index + m[0].lastIndexOf('(');
    const endIdx = findClosingParen(src, startIdx + 1);
    if (endIdx === -1) continue;
    const inner = src.slice(startIdx + 1, endIdx);
    const args = splitTopLevelCommas(inner);
    let routePath = '';
    if (args.length > 0) {
      const first = args[0].trim();
      const strMatch = first.match(/^(['"`])([\s\S]*)\1$/);
      if (strMatch) routePath = strMatch[2];
      else routePath = first;
    }
    const middlewares = args.slice(1, -1).map(s => s.replace(/\s+/g,' ')).filter(Boolean);
    let handler = args.length ? args[args.length - 1].replace(/\s+/g,' ').trim() : '';
    if (/function\s*\(|=>/.test(handler)) handler = 'inline';
    else {
      handler = handler.replace(/\)\s*=>.*$/s, '').replace(/;?$/,'');
      const parts = handler.split(/\s|\(|\)|\.|,/).filter(Boolean);
      handler = parts.length ? parts[parts.length-1] : handler;
    }
    results.push({ method, path: routePath, middlewares: middlewares.join('|'), handler, file });
  }
  return results;
}

function main() {
  const roots = [path.join(process.cwd(), 'src', 'api'), path.join(process.cwd(), 'src', 'routes')];
  const files = [];
  roots.forEach(r => {
    if (fs.existsSync(r)) walk(r, files);
  });
  const rows = [];
  for (const f of files) {
    try {
      const ex = extractFromFile(f);
      ex.forEach(e => rows.push(e));
    } catch (err) {
      // ignore
    }
  }
  const outDir = path.join(process.cwd(), 'docs', 'openapi');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'endpoints.csv');
  const header = 'method,path,middlewares,handler,file\r\n';
  const lines = rows.map(r => {
    function esc(s) { if (s == null) return ''; return '"' + String(s).replace(/"/g, '""') + '"'; }
    return [esc(r.method), esc(r.path), esc(r.middlewares), esc(r.handler), esc(path.relative(process.cwd(), r.file))].join(',');
  });
  fs.writeFileSync(outFile, header + lines.join('\r\n'));
  console.log('Wrote', outFile, 'with', rows.length, 'rows');
}

main();
