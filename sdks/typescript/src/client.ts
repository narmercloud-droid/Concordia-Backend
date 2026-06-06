import fetch from 'node-fetch';
import * as Models from './models';

export class ConcordiaClient {
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

  // Operation methods (generated from operationId)
  async adminLogin(payload: Models.AdminLoginRequest): Promise<Models.AuthResponse> {
    const res = await fetch(`${this.baseUrl}/api/auth/login`, { method: 'POST', headers: this.headers(), body: JSON.stringify(payload) });
    return res.json();
  }

  async requestMagicLink(payload: Models.RequestMagicLinkRequest): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/auth/request-link`, { method: 'POST', headers: this.headers(), body: JSON.stringify(payload) });
    return res.json();
  }

  // ... other methods should be added similarly. This SDK includes core examples.
}

export default ConcordiaClient;
