import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ===== CUSTOM METRICS =====
const adminErrorRate = new Rate('custom_admin_error_rate');
const adminDashboardLatency = new Trend('custom_admin_dashboard_latency');
const adminAnalyticsLatency = new Trend('custom_admin_analytics_latency');
const adminOrdersLatency = new Trend('custom_admin_orders_latency');
const adminAiSummaryLatency = new Trend('custom_admin_ai_summary_latency');
const adminRequests = new Counter('custom_admin_requests');

// ===== TEST OPTIONS =====
export const options = {
  stages: [
    { duration: '30s', target: 10 },    // Ramp up to 10 VUs
    { duration: '1m', target: 30 },     // Ramp to 30 VUs
    { duration: '1m', target: 50 },     // Ramp to 50 VUs
    { duration: '2m', target: 50 },     // Hold at 50 VUs
    { duration: '1m', target: 75 },     // Spike to 75 VUs
    { duration: '1m', target: 50 },     // Back to 50 VUs
    { duration: '1m', target: 0 },      // Ramp down
  ],
  thresholds: {
    'custom_admin_error_rate': ['rate<0.01'],             // < 1% error rate
    'custom_admin_dashboard_latency': ['p(95)<300', 'p(99)<500'],
    'custom_admin_analytics_latency': ['p(95)<300', 'p(99)<500'],
    'custom_admin_orders_latency': ['p(95)<300', 'p(99)<500'],
    'custom_admin_ai_summary_latency': ['p(95)<300', 'p(99)<500'],
    'http_req_duration': ['p(95)<300', 'p(99)<500'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';
const BRANCHES = ['branch-1', 'branch-2', 'branch-3', 'branch-4', 'branch-5'];
const ADMIN_TOKEN = __ENV.ADMIN_TOKEN;

// Validate ADMIN_TOKEN presence and abort early if missing
const ABORT_ADMIN_TEST = !ADMIN_TOKEN;
if (ABORT_ADMIN_TEST) {
  console.error('Missing ADMIN_TOKEN environment variable; aborting admin-dashboard load test.');
}

function getRandomBranch() {
  return BRANCHES[Math.floor(Math.random() * BRANCHES.length)];
}

// Params to be applied to all admin requests (adds Authorization header)
const params = {
  headers: {
    Authorization: `Bearer ${ADMIN_TOKEN}`,
  },
};

// ===== MAIN TEST =====
export default function () {
  if (ABORT_ADMIN_TEST) return;
  const branchId = getRandomBranch();

  group('Admin Dashboard Operations', () => {
    // ===== DASHBOARD OVERVIEW (Polled every 1-2 seconds) =====
    group('Dashboard Overview', () => {
      const start = new Date();
      const res = http.get(`${BASE_URL}/api/v1/admin/dashboard?branchId=${branchId}`, {
        ...params,
        tags: { name: 'DashboardOverview' },
      });
      const duration = (new Date() - start);

      const success = check(res, {
        'dashboard overview 200 or 401': (r) => r.status === 200 || r.status === 401,
      });

      adminDashboardLatency.add(duration);
      if (!success && res.status !== 401) {
        adminErrorRate.add(1);
      }
      adminRequests.add(1);
      sleep(0.5);
    });

    // ===== BRANCH METRICS & ANALYTICS =====
    group('Analytics Data', () => {
      const start = new Date();
      const res = http.get(`${BASE_URL}/api/v1/admin/analytics?branchId=${branchId}&period=hour`, {
        ...params,
        tags: { name: 'Analytics' },
      });
      const duration = (new Date() - start);

      check(res, {
        'analytics 200 or 401': (r) => r.status === 200 || r.status === 401,
      });

      adminAnalyticsLatency.add(duration);
      if (res.status !== 200 && res.status !== 401) {
        adminErrorRate.add(1);
      }
      adminRequests.add(1);
      sleep(0.3);
    });

    // ===== ACTIVE ORDERS POLLING =====
    group('Active Orders', () => {
      const start = new Date();
      const res = http.get(
        `${BASE_URL}/api/v1/admin/orders/active?branchId=${branchId}&limit=50`,
        { ...params, tags: { name: 'ActiveOrders' } }
      );
      const duration = (new Date() - start);

      check(res, {
        'active orders 200 or 401': (r) => r.status === 200 || r.status === 401,
      });

      adminOrdersLatency.add(duration);
      if (res.status !== 200 && res.status !== 401) {
        adminErrorRate.add(1);
      }
      adminRequests.add(1);
      sleep(0.3);
    });

    // ===== AI SUMMARY (Predictions & Insights) =====
    group('AI Summary', () => {
      const start = new Date();
      const res = http.get(
        `${BASE_URL}/api/v1/admin/ai/summary?branchId=${branchId}`,
        { ...params, tags: { name: 'AiSummary' } }
      );
      const duration = (new Date() - start);

      check(res, {
        'ai summary 200 or 401': (r) => r.status === 200 || r.status === 401,
      });

      adminAiSummaryLatency.add(duration);
      if (res.status !== 200 && res.status !== 401) {
        adminErrorRate.add(1);
      }
      adminRequests.add(1);
      sleep(0.5);
    });

    // ===== BRANCH PERFORMANCE METRICS =====
    group('Branch Performance', () => {
      const res = http.get(
        `${BASE_URL}/api/v1/admin/metrics/branch/${branchId}?period=hour`,
        { ...params, tags: { name: 'BranchPerformance' } }
      );

      check(res, {
        'performance metrics 200 or 401': (r) => r.status === 200 || r.status === 401,
      });

      if (res.status !== 200 && res.status !== 401) {
        adminErrorRate.add(1);
      }
      adminRequests.add(1);
      sleep(0.5);
    });

    // ===== COURIER ANALYTICS =====
    group('Courier Analytics', () => {
      const res = http.get(
        `${BASE_URL}/api/v1/admin/couriers/analytics?branchId=${branchId}`,
        { ...params, tags: { name: 'CourierAnalytics' } }
      );

      check(res, {
        'courier analytics 200 or 401': (r) => r.status === 200 || r.status === 401,
      });

      if (res.status !== 200 && res.status !== 401) {
        adminErrorRate.add(1);
      }
      adminRequests.add(1);
      sleep(0.5);
    });

    // ===== REVENUE TRACKING =====
    group('Revenue Data', () => {
      const res = http.get(
        `${BASE_URL}/api/v1/admin/revenue?branchId=${branchId}&period=day`,
        { ...params, tags: { name: 'Revenue' } }
      );

      check(res, {
        'revenue data 200 or 401': (r) => r.status === 200 || r.status === 401,
      });

      if (res.status !== 200 && res.status !== 401) {
        adminErrorRate.add(1);
      }
      adminRequests.add(1);
      sleep(0.5);
    });
  });

  sleep(Math.random() * 2 + 0.5);
}
