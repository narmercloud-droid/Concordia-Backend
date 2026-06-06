const path = require('path');
const fs = require('fs');

// mapping: operationId -> dotted path on client (e.g. 'admin.login' or 'orders.get')
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
  adminPatchOrderStatus: 'admin.orders.patchStatus',
  adminGetMenu: 'admin.menu.list',
  adminCreateMenu: 'admin.menu.create',
  adminPatchMenuItem: 'admin.menu.updateItem',
  adminDeleteMenuItem: 'admin.menu.deleteItem',
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
  setOrderStatus: 'orders.setStatus',
  courierClaimAssignment: 'courier.claim',
  courierPickedUp: 'courier.pickedUp',
  courierDelivered: 'courier.delivered',
  getOpeningHours: 'admin.openingHours.get',
  updateOpeningHours: 'admin.openingHours.update',
  listHolidayOverrides: 'admin.holidays.list',
  createHolidayOverride: 'admin.holidays.create',
  createVoucher: 'admin.vouchers.create',
  invalidateVoucher: 'admin.vouchers.invalidate',
  listVouchers: 'admin.vouchers.list',
  refundOrder: 'admin.refund',
  assignCourier: 'admin.assignCourier',
  getMenu: 'menu.list',
  createCategory: 'menu.category.create',
  updateCategory: 'menu.category.update',
  createMenuItem: 'menu.item.create',
  updateMenuItem: 'menu.item.update',
  createVariant: 'menu.variant.create',
  setVariantAvailability: 'menu.variant.setAvailability',
  validateOffer: 'offers.validate',
  getMetrics: 'metrics.get',
  authLogin: 'auth.login',
  getRoot: 'root.get',
  postRoot: 'root.post',
  patchRoot: 'root.patch',
  updateAddress: 'addresses.update',
  deleteAddress: 'addresses.delete',
  requestOtp: 'auth.requestOtp',
  verifyOtp: 'auth.verifyOtp',
  postRefresh: 'auth.refresh',
  getOrder: 'orders.get',
  postReport: 'reports.post',
  getBranch: 'branches.get',
  registerCustomer: 'auth.register',
  getOrderStatus: 'orders.status',
  applyOffer: 'offers.apply',
  getBranchSlots: 'branches.slots.get'
};

function findClient() {
  // try admin SDK first
  const candidates = [
    path.resolve(process.cwd(), 'sdks-admin', 'typescript', 'dist', 'client'),
    path.resolve(process.cwd(), 'sdks', 'typescript', 'dist', 'client'),
    path.resolve(process.cwd(), 'sdks-admin', 'typescript', 'dist'),
    path.resolve(process.cwd(), 'sdks', 'typescript', 'dist')
  ];
  for (const c of candidates) {
    try {
      if (fs.existsSync(c) || fs.existsSync(c + '.js')) {
        const mod = require(c);
        // module may export a default constructor or named export
        if (mod && (typeof mod === 'function' || typeof mod.default === 'function')) return mod.default || mod;
        return mod;
      }
    } catch (e) {
      // ignore
    }
  }
  return null;
}

function mapOperationToMethod(operationId) {
  if (Object.prototype.hasOwnProperty.call(mapping, operationId)) return mapping[operationId];
  return null;
}

async function callSdk(operationId, params = {}, opts = {}) {
  const Client = findClient();
  if (!Client) throw new Error('TypeScript SDK client not found in sdks-admin/typescript/dist or sdks/typescript/dist');
  // create client instance; params may include auth token
  const baseUrl = opts.baseUrl || process.env.SDK_TEST_BASEURL || 'http://localhost:4000';
  const token = opts.token || null;
  let client;
  try {
    if (typeof Client === 'function') {
      // constructor expects baseUrl and optional token
      client = new Client(baseUrl, token);
    } else {
      client = Client;
    }
  } catch (e) {
    client = Client;
  }

  const methodPath = mapOperationToMethod(operationId);
  if (!methodPath) {
    // signal missing mapping to caller (adapter will return a failure object)
    return { statusCode: 501, body: { error: 'missing mapping', operationId } };
  }
  // resolve dotted path on client
  const parts = methodPath.split('.');
  let fn = client;
  for (const p of parts) {
    if (fn && typeof fn[p] !== 'undefined') fn = fn[p]; else { fn = null; break; }
  }
  if (typeof fn !== 'function') return { statusCode: 502, body: { error: 'sdk_method_not_found', tried: methodPath, operationId } };

  // Prepare args: many generated SDKs accept a single object param
  const arg = {};
  if (params.body) arg.body = params.body;
  if (params.path) Object.assign(arg, params.path);
  if (params.query) arg.query = params.query;
  if (params.headers) arg.headers = params.headers;

  const res = await fn.call(client, arg);
  // normalize response
  if (res && res.status) return { statusCode: res.status, body: res };
  return { statusCode: 200, body: res };
}

async function invoke(entry, opts = {}) {
  const { baseUrl = 'http://localhost:4000', fetch, params, resolvedPath } = opts;
  // try SDK call first
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
  // append query params if present
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
