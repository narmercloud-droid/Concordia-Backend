import fetch from 'node-fetch';
import * as Models from './models';

export class ConcordiaAdminClient {
  baseUrl: string;
  token?: string;
  constructor(baseUrl: string = 'https://api.concordia.app', token?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.token = token;
  }
  private headers() {
    const h: any = { 'Content-Type': 'application/json' };
    if (this.token) h.Authorization = `Bearer ${this.token}`;
    return h;
  }

  async adminAuthLogin(payload: Models.AdminLoginRequest): Promise<Models.AuthResponse> {
    const res = await fetch(`${this.baseUrl}/api/admin/auth/login`, { method: 'POST', headers: this.headers(), body: JSON.stringify(payload) });
    return res.json();
  }

  async adminAuthLogout(): Promise<Models.GenericResponse> {
    const res = await fetch(`${this.baseUrl}/api/admin/auth/logout`, { method: 'POST', headers: this.headers() });
    return res.json();
  }

  async adminListOrders(): Promise<Models.Order[]> {
    const res = await fetch(`${this.baseUrl}/api/admin/orders`, { method: 'GET', headers: this.headers() });
    return res.json();
  }

  async adminGetOrder(orderId: string): Promise<Models.Order> {
    const res = await fetch(`${this.baseUrl}/api/admin/orders/${orderId}`, { method: 'GET', headers: this.headers() });
    return res.json();
  }

  async adminPatchOrderStatus(orderId: string, status: string): Promise<Models.Order> {
    const res = await fetch(`${this.baseUrl}/api/admin/orders/${orderId}/status`, { method: 'PATCH', headers: this.headers(), body: JSON.stringify({ status }) });
    return res.json();
  }

  // Menu
  async adminGetMenu(): Promise<Models.MenuItem[]> {
    const res = await fetch(`${this.baseUrl}/api/admin/menu`, { method: 'GET', headers: this.headers() });
    return res.json();
  }

  async adminCreateMenu(item: Models.MenuItem): Promise<Models.MenuItem> {
    const res = await fetch(`${this.baseUrl}/api/admin/menu`, { method: 'POST', headers: this.headers(), body: JSON.stringify(item) });
    return res.json();
  }

  async adminPatchMenuItem(itemId: string, item: Models.MenuItem): Promise<Models.MenuItem> {
    const res = await fetch(`${this.baseUrl}/api/admin/menu/${itemId}`, { method: 'PATCH', headers: this.headers(), body: JSON.stringify(item) });
    return res.json();
  }

  async adminDeleteMenuItem(itemId: string): Promise<Models.GenericResponse> {
    const res = await fetch(`${this.baseUrl}/api/admin/menu/${itemId}`, { method: 'DELETE', headers: this.headers() });
    return res.json();
  }

  // Branches
  async adminListBranches(): Promise<Models.Address[]> {
    const res = await fetch(`${this.baseUrl}/api/admin/branches`, { method: 'GET', headers: this.headers() });
    return res.json();
  }

  async adminCreateBranch(branch: Models.Address): Promise<Models.Address> {
    const res = await fetch(`${this.baseUrl}/api/admin/branches`, { method: 'POST', headers: this.headers(), body: JSON.stringify(branch) });
    return res.json();
  }

  async adminPatchBranch(branchId: string, branch: Models.Address): Promise<Models.Address> {
    const res = await fetch(`${this.baseUrl}/api/admin/branches/${branchId}`, { method: 'PATCH', headers: this.headers(), body: JSON.stringify(branch) });
    return res.json();
  }

  // Metrics
  async adminMetricsOverview(): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/admin/metrics/overview`, { method: 'GET', headers: this.headers() });
    return res.json();
  }

  async adminMetricsOrders(): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/admin/metrics/orders`, { method: 'GET', headers: this.headers() });
    return res.json();
  }

  async adminMetricsCustomers(): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/admin/metrics/customers`, { method: 'GET', headers: this.headers() });
    return res.json();
  }
}

export default ConcordiaAdminClient;
