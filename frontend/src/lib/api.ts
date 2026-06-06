const BACKEND_BASE = "http://localhost:3001";

async function backendRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`${BACKEND_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${response.status}`);
  }

  return response.json();
}

async function proxyRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`/api/proxy${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Proxy request failed: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getMenu: async () => backendRequest("/api/v1/menu"),
  requestMagicLink: async (email: string) => backendRequest("/api/auth/request-link", {
    method: "POST",
    body: JSON.stringify({ email })
  }),
  verifyMagicLink: async (token: string) => backendRequest(`/api/auth/verify?token=${encodeURIComponent(token)}`),
  getOrder: async (orderId: string) => backendRequest(`/track/order/${encodeURIComponent(orderId)}`),

  getProfile: async () => proxyRequest("/customers/profile"),
  updatePhone: async (phoneNumber: string) => proxyRequest("/customers/phone", {
    method: "PUT",
    body: JSON.stringify({ phoneNumber })
  }),
  updateMarketingPreferences: async (prefs: any) => proxyRequest("/customer/marketing-preferences", {
    method: "PUT",
    body: JSON.stringify(prefs)
  }),
  requestAdminMagicLink: async (email: string) => backendRequest("/api/auth/admin/request-link", {
    method: "POST",
    body: JSON.stringify({ email })
  }),
  verifyAdminMagicLink: async (token: string) => backendRequest(`/api/auth/admin/verify?token=${encodeURIComponent(token)}`),
  getAdminProfile: async () => proxyRequest("/admin/me"),
  getBranchRevenue: async (branchId: string) => proxyRequest(`/dashboard/branch/${encodeURIComponent(branchId)}/revenue`),
  getBranchOrders: async (branchId: string) => proxyRequest(`/dashboard/branch/${encodeURIComponent(branchId)}/orders`),
  getBranchCouriers: async (branchId: string) => proxyRequest(`/dashboard/branch/${encodeURIComponent(branchId)}/couriers`),
  getAddresses: async () => proxyRequest("/customers/addresses"),
  getAddress: async (id: string) => proxyRequest(`/customers/addresses/${id}`),
  createAddress: async (data: any) => proxyRequest("/customers/addresses", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  updateAddress: async (id: string, data: any) => proxyRequest(`/customers/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  }),
  deleteAddress: async (id: string) => proxyRequest(`/customers/addresses/${id}`, {
    method: "DELETE"
  }),
  createOrder: async (orderData: any) => proxyRequest("/order/create", {
    method: "POST",
    body: JSON.stringify(orderData)
  }),
  getOrderHistory: async (customerId: string) => proxyRequest(`/orders/customer/${customerId}`),
  validateOffer: async (code: string, order: any) => proxyRequest("/offers/validate", {
    method: "POST",
    body: JSON.stringify({ code, order })
  }),
  getCampaigns: async () => proxyRequest("/admin/campaigns"),
  createCampaign: async (campaignData: any) => proxyRequest("/admin/campaigns", {
    method: "POST",
    body: JSON.stringify(campaignData)
  }),
  updateCampaign: async (id: number, campaignData: any) => proxyRequest(`/admin/campaigns/${id}`, {
    method: "PUT",
    body: JSON.stringify(campaignData)
  }),
  deleteCampaign: async (id: number) => proxyRequest(`/admin/campaigns/${id}`, {
    method: "DELETE"
  }),
  scheduleCampaign: async (id: number, scheduledFor: string) => proxyRequest(`/admin/campaigns/${id}/schedule`, {
    method: "POST",
    body: JSON.stringify({ scheduledFor })
  }),
  sendCampaignNow: async (id: number) => proxyRequest(`/admin/campaigns/${id}/send-now`, {
    method: "POST"
  }),
  getSegments: async () => proxyRequest("/admin/segments"),
  createSegment: async (segmentData: any) => proxyRequest("/admin/segments", {
    method: "POST",
    body: JSON.stringify(segmentData)
  }),
  logout: async () => proxyRequest("/auth/logout", { method: "POST" })
};
