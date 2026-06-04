const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// mapping: operationId -> dotted path on python client (e.g. 'admin.login' or 'orders.get')
const mapping = {
  adminLogin: 'admin.login',
  requestMagicLink: 'auth.request_link',
  verifyMagicToken: 'auth.verify',
  verifyAdminMagicToken: 'auth.admin.verify',
  authLogout: 'auth.logout',
  adminAuthLogin: 'admin.auth.login',
  adminAuthLogout: 'admin.auth.logout',
  adminListOrders: 'admin.orders.list',
  adminGetOrder: 'admin.orders.get',
  adminPatchOrderStatus: 'admin.orders.patch_status',
  adminGetMenu: 'admin.menu.list',
  adminCreateMenu: 'admin.menu.create',
  adminPatchMenuItem: 'admin.menu.update_item',
  adminDeleteMenuItem: 'admin.menu.delete_item',
  adminListBranches: 'admin.branches.list',
  adminCreateBranch: 'admin.branches.create',
  adminPatchBranch: 'admin.branches.update',
  adminMetricsOverview: 'admin.metrics.overview',
  adminMetricsOrders: 'admin.metrics.orders',
  adminMetricsCustomers: 'admin.metrics.customers',
  webhookOrderCreated: 'webhooks.order.created',
  webhookOrderUpdated: 'webhooks.order.updated',
  webhookOrderStatusChanged: 'webhooks.order.status_changed',
  webhookPaymentSucceeded: 'webhooks.payment.succeeded',
  webhookPaymentFailed: 'webhooks.payment.failed',
  webhookCourierAssigned: 'webhooks.courier.assigned',
  webhookCourierLocationUpdated: 'webhooks.courier.location_updated',
  webhookBranchOpeningHoursChanged: 'webhooks.branch.opening_hours_changed',
  createOrder: 'orders.create',
  adminListBranchOrders: 'admin.branches.orders.list',
  setOrderStatus: 'orders.set_status',
  courierClaimAssignment: 'courier.claim',
  courierPickedUp: 'courier.picked_up',
  courierDelivered: 'courier.delivered',
  getOpeningHours: 'admin.opening_hours.get',
  updateOpeningHours: 'admin.opening_hours.update',
  listHolidayOverrides: 'admin.holidays.list',
  createHolidayOverride: 'admin.holidays.create',
  createVoucher: 'admin.vouchers.create',
  invalidateVoucher: 'admin.vouchers.invalidate',
  listVouchers: 'admin.vouchers.list',
  refundOrder: 'admin.refund',
  assignCourier: 'admin.assign_courier',
  getMenu: 'menu.list',
  createCategory: 'menu.category.create',
  updateCategory: 'menu.category.update',
  createMenuItem: 'menu.item.create',
  updateMenuItem: 'menu.item.update',
  createVariant: 'menu.variant.create',
  setVariantAvailability: 'menu.variant.set_availability',
  validateOffer: 'offers.validate',
  getMetrics: 'metrics.get',
  authLogin: 'auth.login',
  getRoot: 'root.get',
  postRoot: 'root.post',
  patchRoot: 'root.patch',
  updateAddress: 'addresses.update',
  deleteAddress: 'addresses.delete',
  requestOtp: 'auth.request_otp',
  verifyOtp: 'auth.verify_otp',
  postRefresh: 'auth.refresh',
  getOrder: 'orders.get',
  postReport: 'reports.post',
  getBranch: 'branches.get',
  registerCustomer: 'auth.register',
  getOrderStatus: 'orders.status',
  applyOffer: 'offers.apply',
  getBranchSlots: 'branches.slots.get'
};

function mapOperationToFunction(operationId) {
  if (Object.prototype.hasOwnProperty.call(mapping, operationId)) return mapping[operationId];
  return null;
}

async function callSdk(operationId, params = {}, opts = {}) {
  return new Promise((resolve, reject) => {
    const bridgePath = path.resolve(process.cwd(), 'sdks-admin', 'python', 'sdk_bridge.py');
    if (!fs.existsSync(bridgePath)) return reject(new Error('sdk_bridge.py not found')); 

    const mapped = mapOperationToFunction(operationId);
    if (!mapped) {
      // return a structured missing-mapping response instead of attempting to call Python
      return resolve({ statusCode: 501, body: { error: 'missing mapping', operationId } });
    }
    const input = JSON.stringify({ operationId: mapped, params, baseUrl: opts.baseUrl });
    const py = spawn('python', [bridgePath], { cwd: path.dirname(bridgePath) });
    let stdout = '';
    let stderr = '';
    py.stdout.on('data', (d) => { stdout += d.toString(); });
    py.stderr.on('data', (d) => { stderr += d.toString(); });
    py.on('error', (err) => reject(err));
    py.on('close', (code) => {
      if (stderr) {
        // include stderr in error but still try to parse stdout
      }
      try {
        const parsed = JSON.parse(stdout || '{}');
        if (parsed && parsed.statusCode) return resolve({ statusCode: parsed.statusCode, body: parsed.body });
        if (parsed && parsed.error) return reject(new Error(parsed.error + (parsed.trace ? '\n'+parsed.trace : '')));
        return resolve({ statusCode: 200, body: parsed });
      } catch (e) {
        return reject(new Error('Failed to parse python bridge output: ' + e.message + '\n' + stderr + '\n' + stdout));
      }
    });
    py.stdin.write(input);
    py.stdin.end();
  });
}

async function invoke(entry, opts = {}) {
  const { baseUrl = 'http://localhost:4000', fetch, params, resolvedPath } = opts;
  try {
    const r = await callSdk(entry.operationId, params || {}, { baseUrl });
    return r;
  } catch (e) {
    // fallback to HTTP
  }

  const url = baseUrl + (resolvedPath || entry.pathTemplate || entry.path).replace(/\{[^}]+\}/g, '1');
  const optsFetch = { method: entry.method, headers: { accept: 'application/json', ...(params && params.headers) } };
  if (['POST', 'PUT', 'PATCH'].includes(entry.method)) {
    optsFetch.headers['content-type'] = 'application/json';
    optsFetch.body = JSON.stringify((params && params.body) || {});
  }
  let finalUrl = url;
  if (params && params.query && Object.keys(params.query).length) {
    const qp = Object.entries(params.query).map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
    finalUrl = finalUrl + (finalUrl.includes('?') ? '&' : '?') + qp;
  }
  const res = await fetch(finalUrl, optsFetch);
  let body = null;
  try { body = await res.json(); } catch (e) { body = await res.text().catch(()=>null); }
  return { statusCode: res.status, body };
}

module.exports = { invoke, callSdk, mapping };
