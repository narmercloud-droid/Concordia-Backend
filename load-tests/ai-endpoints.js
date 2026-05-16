import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ===== CUSTOM METRICS =====
const aiErrorRate = new Rate('custom_ai_error_rate');
const aiChurnPredictionLatency = new Trend('custom_ai_churn_prediction_latency');
const aiLtvPredictionLatency = new Trend('custom_ai_ltv_prediction_latency');
const aiDemandForecastLatency = new Trend('custom_ai_demand_forecast_latency');
const aiTopMenuLatency = new Trend('custom_ai_top_menu_latency');
const aiCacheHits = new Counter('custom_ai_cache_hits');
const aiCacheMisses = new Counter('custom_ai_cache_misses');
const aiRequests = new Counter('custom_ai_requests');

// ===== TEST OPTIONS =====
export const options = {
  stages: [
    { duration: '1m', target: 20 },     // Ramp up to 20 VUs
    { duration: '1m', target: 50 },     // Ramp to 50 VUs
    { duration: '2m', target: 75 },     // Ramp to 75 VUs
    { duration: '2m', target: 75 },     // Hold at 75 VUs
    { duration: '1m', target: 100 },    // Spike to 100 VUs
    { duration: '1m', target: 50 },     // Cool down to 50 VUs
    { duration: '1m', target: 0 },      // Ramp down
  ],
  thresholds: {
    'custom_ai_error_rate': ['rate<0.01'],              // < 1% error rate
    'custom_ai_churn_prediction_latency': ['p(95)<300', 'p(99)<500'],
    'custom_ai_ltv_prediction_latency': ['p(95)<300', 'p(99)<500'],
    'custom_ai_demand_forecast_latency': ['p(95)<300', 'p(99)<500'],
    'custom_ai_top_menu_latency': ['p(95)<300', 'p(99)<500'],
    'http_req_duration': ['p(95)<300', 'p(99)<500'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';
const BRANCHES = ['branch-1', 'branch-2', 'branch-3', 'branch-4', 'branch-5'];

function getRandomBranch() {
  return BRANCHES[Math.floor(Math.random() * BRANCHES.length)];
}

function getRandomCustomerId() {
  return `customer_${Math.floor(Math.random() * 5000)}`;
}

// ===== MAIN TEST =====
export default function () {
  const branchId = getRandomBranch();
  const customerId = getRandomCustomerId();

  group('AI Prediction Endpoints', () => {
    // ===== CHURN PREDICTION =====
    group('Churn Prediction', () => {
      const start = new Date();
      const res = http.get(`${BASE_URL}/api/v1/ai/customer/${customerId}/churn`, {
        tags: { name: 'ChurnPrediction' },
      });
      const duration = (new Date() - start);

      const success = check(res, {
        'churn prediction 200 or 404': (r) => r.status === 200 || r.status === 404,
      });

      aiChurnPredictionLatency.add(duration);
      if (res.headers['X-Cache'] === 'HIT') {
        aiCacheHits.add(1);
      } else {
        aiCacheMisses.add(1);
      }

      if (!success) {
        aiErrorRate.add(1);
      }
      aiRequests.add(1);
      sleep(0.5);
    });

    // ===== LTV PREDICTION =====
    group('LTV Prediction', () => {
      const start = new Date();
      const res = http.get(`${BASE_URL}/api/v1/ai/customer/${customerId}/ltv`, {
        tags: { name: 'LtvPrediction' },
      });
      const duration = (new Date() - start);

      const success = check(res, {
        'ltv prediction 200 or 404': (r) => r.status === 200 || r.status === 404,
      });

      aiLtvPredictionLatency.add(duration);
      if (res.headers['X-Cache'] === 'HIT') {
        aiCacheHits.add(1);
      } else {
        aiCacheMisses.add(1);
      }

      if (!success) {
        aiErrorRate.add(1);
      }
      aiRequests.add(1);
      sleep(0.5);
    });

    // ===== DEMAND FORECAST =====
    group('Demand Forecast', () => {
      const start = new Date();
      const res = http.get(`${BASE_URL}/api/v1/ai/branch/${branchId}/demand?hours=24`, {
        tags: { name: 'DemandForecast' },
      });
      const duration = (new Date() - start);

      const success = check(res, {
        'demand forecast 200 or 404': (r) => r.status === 200 || r.status === 404,
      });

      aiDemandForecastLatency.add(duration);
      if (res.headers['X-Cache'] === 'HIT') {
        aiCacheHits.add(1);
      } else {
        aiCacheMisses.add(1);
      }

      if (!success) {
        aiErrorRate.add(1);
      }
      aiRequests.add(1);
      sleep(0.5);
    });

    // ===== TOP MENU ITEMS =====
    group('Top Menu Items', () => {
      const start = new Date();
      const res = http.get(`${BASE_URL}/api/v1/ai/branch/${branchId}/menu/top?limit=10`, {
        tags: { name: 'TopMenu' },
      });
      const duration = (new Date() - start);

      const success = check(res, {
        'top menu 200 or 404': (r) => r.status === 200 || r.status === 404,
      });

      aiTopMenuLatency.add(duration);
      if (res.headers['X-Cache'] === 'HIT') {
        aiCacheHits.add(1);
      } else {
        aiCacheMisses.add(1);
      }

      if (!success) {
        aiErrorRate.add(1);
      }
      aiRequests.add(1);
      sleep(0.3);
    });

    // ===== BEHAVIOR ANALYTICS =====
    group('Behavior Analytics', () => {
      const start = new Date();
      const res = http.get(`${BASE_URL}/api/v1/ai/customer/${customerId}/behavior`, {
        tags: { name: 'BehaviorAnalytics' },
      });
      const duration = (new Date() - start);

      check(res, {
        'behavior analytics 200 or 404': (r) => r.status === 200 || r.status === 404,
      });

      if (res.status !== 200 && res.status !== 404) {
        aiErrorRate.add(1);
      }
      aiRequests.add(1);
      sleep(0.3);
    });

    // ===== PRICE OPTIMIZATION =====
    group('Price Optimization', () => {
      const start = new Date();
      const res = http.get(`${BASE_URL}/api/v1/ai/branch/${branchId}/pricing`, {
        tags: { name: 'PriceOptimization' },
      });
      const duration = (new Date() - start);

      check(res, {
        'price optimization 200 or 404': (r) => r.status === 200 || r.status === 404,
      });

      if (res.status !== 200 && res.status !== 404) {
        aiErrorRate.add(1);
      }
      aiRequests.add(1);
      sleep(0.3);
    });
  });

  sleep(Math.random() * 2 + 0.5);
}
