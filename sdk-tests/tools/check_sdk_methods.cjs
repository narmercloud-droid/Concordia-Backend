const path = require('path');
const fs = require('fs');
const manifest = require('../manifest.json');
const tsAdapter = require('../adapters/typescript.cjs');
const pyAdapter = require('../adapters/python.cjs');

function findTsClient() {
  const candidates = [
    path.resolve(process.cwd(), '..', 'sdks-admin', 'typescript', 'dist', 'client'),
    path.resolve(process.cwd(), '..', 'sdks', 'typescript', 'dist', 'client'),
    path.resolve(process.cwd(), '..', 'sdks-admin', 'typescript', 'dist'),
    path.resolve(process.cwd(), '..', 'sdks', 'typescript', 'dist')
  ];
  for (const c of candidates) {
    try {
      if (fs.existsSync(c) || fs.existsSync(c + '.js')) {
        return require(c);
      }
    } catch (e) {}
  }
  return null;
}

function hasPath(obj, dotted) {
  if (!obj) return false;
  const parts = dotted.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur && typeof cur[p] !== 'undefined') cur = cur[p]; else return false;
  }
  return typeof cur === 'function' || typeof cur === 'object';
}

console.log('Checking SDK method availability (best-effort)');
const tsClient = findTsClient();
console.log('TS client found:', !!tsClient);
const tsMissing = [];
for (const [k,v] of Object.entries(tsAdapter.mapping||{})) {
  if (!tsClient) break;
  if (!hasPath(tsClient, v)) tsMissing.push({op:k, tried:v});
}
console.log('TS mapping method misses (if client present):', tsMissing.length, tsMissing.slice(0,10));

// Python: try importing concordia_admin_client to inspect
let pyClient = null;
try {
  pyClient = require(path.resolve(process.cwd(), '..', 'sdks-admin', 'python'));
} catch (e) {
  try { pyClient = require('concordia_admin_client'); } catch (e) { pyClient = null; }
}
console.log('PY client found (module):', !!pyClient);
const pyMissing = [];
if (pyClient) {
  for (const [k,v] of Object.entries(pyAdapter.mapping||{})) {
    if (!hasPath(pyClient, v)) pyMissing.push({op:k, tried:v});
  }
}
console.log('PY mapping method misses (if client present):', pyMissing.length, pyMissing.slice(0,10));

module.exports = { tsMissing, pyMissing };
