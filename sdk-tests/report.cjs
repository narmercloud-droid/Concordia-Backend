const fs = require('fs');
const path = require('path');

function generate(results, outPath) {
  const total = results.length;
  const passed = results.filter(r=>r.ok).length;
  const failed = total - passed;

  const bySdk = results.reduce((acc, r) => {
    acc[r.sdk] = acc[r.sdk] || { total: 0, passed: 0, failed: 0 };
    acc[r.sdk].total++;
    if (r.ok) acc[r.sdk].passed++; else acc[r.sdk].failed++;
    return acc;
  }, {});

  const byOperation = results.reduce((acc, r) => {
    acc[r.operationId] = acc[r.operationId] || { total: 0, passed: 0, failed: 0 };
    acc[r.operationId].total++;
    if (r.ok) acc[r.operationId].passed++; else acc[r.operationId].failed++;
    return acc;
  }, {});

  const report = { generatedAt: new Date().toISOString(), summary: { total, passed, failed }, bySdk, byOperation, results };
  // detect missing SDK mappings
  const missing = results.filter(r=>r.reason && /SDK method not found/i.test(r.reason)).reduce((acc, r)=>{
    acc[r.sdk] = acc[r.sdk] || [];
    acc[r.sdk].push(r.operationId);
    return acc;
  }, {});
  if (Object.keys(missing).length) report.missingMappings = missing;
  const p = outPath || path.resolve(process.cwd(), 'sdk-tests', 'report.json');
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(report, null, 2));
  return report;
}

module.exports = { generate };
