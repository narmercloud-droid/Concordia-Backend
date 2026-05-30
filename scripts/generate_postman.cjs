const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '..', 'src', 'routes');
const controllersDir = path.join(__dirname, '..', 'src', 'controllers');

function walk(dir) {
  const list = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) list.push(...walk(p));
    else if (p.endsWith('.ts') || p.endsWith('.js')) list.push(p);
  }
  return list;
}

function extractRoutesFromFile(content) {
  const results = [];
  const routeRegex = /(router|app)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`\)]+)['"`\)]/g;
  let m;
  while ((m = routeRegex.exec(content))) {
    const prefix = m[1];
    const method = m[2].toUpperCase();
    const route = m[3];
    results.push({ method, route, prefix });
  }
  return results;
}

function findMiddlewareInfo(line) {
  const middlewares = [];
  const validateMatch = line.match(/validate\(([^)]+)\)/);
  if (validateMatch) middlewares.push({ type: 'validate', schema: validateMatch[1].trim() });
  if (line.includes('validateTerminalToken')) middlewares.push({ type: 'terminalToken' });
  if (line.includes('authenticate') || line.includes('validateAuth') || line.includes('ensureAuth')) middlewares.push({ type: 'auth' });
  return middlewares;
}

function extractAll() {
  const routeFiles = walk(routesDir);
  const indexPath = path.join(__dirname, '..', 'src', 'index.ts');
  if (fs.existsSync(indexPath)) routeFiles.push(indexPath);

  const endpoints = [];
  for (const file of routeFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    const routes = extractRoutesFromFile(content);
    if (routes.length === 0) continue;
    for (const r of routes) {
      const re = new RegExp("(router|app)\\." + r.method.toLowerCase() + "\\s*\\(\\s*['\"\\\`]" + escapeRegExp(r.route) + "[\'\"\`][^\\n]*","i");
      const foundLine = lines.find(function(l){ return re.test(l); });
      const middleware = foundLine ? findMiddlewareInfo(foundLine) : [];
      const params = (r.route.match(/:([a-zA-Z0-9_]+)/g) || []).map(function(s){ return s.slice(1); });
      endpoints.push({ method: r.method, path: r.route, file: path.relative(path.join(__dirname, '..'), file), params, middleware });
    }
  }
  return endpoints;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildPostman(endpoints) {
  const collection = {
    info: {
      name: 'Concordia-Backend API',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    item: []
  };

  const folders = {
    Auth: [], Orders: [], Cart: [], Menu: [], Payments: [], Terminals: [], KDS: [], Notifications: [], Loyalty: [], Admin: [], 'Manager Dashboard': [], Search: [], Reviews: [], Analytics: [], PayPal: [], 'AI / Optimization': []
  };

  for (const e of endpoints) {
    const p = e.path.toLowerCase();
    var folder = 'AI / Optimization';
    if (p.includes('/auth') || p.includes('login') || p.includes('token') || p.includes('refresh')) folder = 'Auth';
    else if (p.includes('/order') || p.includes('/orders') || p.includes('/checkout')) folder = 'Orders';
    else if (p.includes('/cart')) folder = 'Cart';
    else if (p.includes('/menu') || p.includes('/item') || p.includes('/category')) folder = 'Menu';
    else if (p.includes('/payment') || p.includes('/payments') || p.includes('/paypal')) folder = 'Payments';
    else if (p.includes('/terminal') || p.includes('/terminals')) folder = 'Terminals';
    else if (p.includes('/kds')) folder = 'KDS';
    else if (p.includes('/notification') || p.includes('/notifications')) folder = 'Notifications';
    else if (p.includes('/loyal') || p.includes('/loyalty')) folder = 'Loyalty';
    else if (p.includes('/admin') || p.includes('/admins') || p.includes('/voucher') || p.includes('/deal') || p.includes('/variant')) folder = 'Admin';
    else if (p.includes('/manager') || p.includes('manager')) folder = 'Manager Dashboard';
    else if (p.includes('/search')) folder = 'Search';
    else if (p.includes('/review')) folder = 'Reviews';
    else if (p.includes('/analytics') || p.includes('forecast') || p.includes('dashboard')) folder = 'Analytics';
    else if (p.includes('paypal')) folder = 'PayPal';

    const headers = [];
    if (e.middleware.some(function(m){ return m.type === 'auth' || m.type === 'terminalToken'; })) headers.push({ key: 'Authorization', value: 'Bearer <token>' });

    const validateMw = e.middleware.find(function(m){ return m.type === 'validate'; });
    const body = validateMw ? { mode: 'raw', raw: '{ /* see schema: ' + validateMw.schema + ' */ }' } : null;

    const item = {
      name: e.method + ' ' + e.path,
      request: {
        method: e.method,
        header: headers.map(function(h){ return { key: h.key, value: h.value }; }),
        url: { raw: '{{baseUrl}}' + e.path, host: ['{{baseUrl}}'], path: e.path.split('/').filter(Boolean) },
      }
    };
    if (body) item.request.body = body;
    item.response = [{ name: 'Success', originalRequest: {}, status: 'OK', code: 200, body: JSON.stringify({ success: true, data: '<example>' }, null, 2) }];

    folders[folder].push(item);
  }

  for (const name in folders) {
    const items = folders[name];
    const folderItem = { name: name, item: items };
    if (name === 'Analytics') folderItem.disabled = true;
    collection.item.push(folderItem);
  }

  return collection;
}

function main() {
  const endpoints = extractAll();
  const collection = buildPostman(endpoints);
  const outPath = path.join(__dirname, '..', 'postman_collection.json');
  fs.writeFileSync(outPath, JSON.stringify(collection, null, 2), 'utf8');
  console.log('Wrote', outPath, 'with', endpoints.length, 'endpoints');
}

main();
