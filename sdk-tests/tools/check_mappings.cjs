const m = require('../manifest.json');
const tsMod = require('../adapters/typescript.cjs');
const pyMod = require('../adapters/python.cjs');
const tsMap = tsMod && tsMod.mapping ? tsMod.mapping : (tsMod && tsMod.mapping === undefined ? require('../adapters/typescript.cjs').mapping : tsMod.mapping);
const pyMap = pyMod && pyMod.mapping ? pyMod.mapping : (pyMod && pyMod.mapping === undefined ? require('../adapters/python.cjs').mapping : pyMod.mapping);
// filter out generated parameter-only pseudo-operations (operationIds that start with 'parameters__')
const tests = (m.tests||[]).map(t=>t.operationId).filter(id => typeof id === 'string' && !id.startsWith('parameters__'));
console.log('Total tests in manifest:', tests.length);
console.log('TS mapping count:', Object.keys(tsMap||{}).length);
console.log('PY mapping count:', Object.keys(pyMap||{}).length);
const missingTs = tests.filter(id=>!(tsMap && Object.prototype.hasOwnProperty.call(tsMap,id)));
const missingPy = tests.filter(id=>!(pyMap && Object.prototype.hasOwnProperty.call(pyMap,id)));
console.log('TS missing:', missingTs.length, missingTs.length?missingTs:[]);
console.log('PY missing:', missingPy.length, missingPy.length?missingPy:[]);
const extraTs = Object.keys(tsMap||{}).filter(k=>!tests.includes(k));
const extraPy = Object.keys(pyMap||{}).filter(k=>!tests.includes(k));
console.log('TS extra mappings (not in manifest):', extraTs.length?extraTs:[]);
console.log('PY extra mappings (not in manifest):', extraPy.length?extraPy:[]);
