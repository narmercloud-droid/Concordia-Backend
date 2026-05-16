import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// ===== CUSTOM METRICS =====
const errorRate = new Rate('custom_order_error_rate');
const orderCreationLatency = new Trend('custom_order_creation_latency');
const orderUpdateLatency = new Trend('custom_order_update_latency');
const orderTrackingLatency = new Trend('custom_order_tracking_latency');
const successfulOrders = new Counter('custom_orders_successful');
const failedOrders = new Counter('custom_orders_failed');
const activeOrders = new Gauge('custom_orders_active');

// ===== TEST OPTIONS =====
export const options = {
  stages: [
    { duration: '30s', target: 50 },    // Ramp-up to 50 VUs
    { duration: '1m', target: 100 },    // Ramp-up to 100 VUs
    { duration: '1m', target: 150 },    // Ramp-up to 150 VUs
    { duration: '2m', target: 150 },    // Hold at 150 VUs
    { duration: '1m', target: 200 },    // Peak load 200 VUs
    { duration: '1m', target: 200 },    // Hold at peak
    { duration: '1m', target: 50 },     // Ramp-down to 50 VUs
    { duration: '30s', target: 0 },     // Final ramp-down
  ],
  thresholds: {
    'custom_order_error_rate': ['rate<0.01'],           // < 1% error rate
    'custom_order_creation_latency': ['p(95)<300', 'p(99)<500'],
    'custom_order_update_latency': ['p(95)<300', 'p(99)<500'],
    'http_req_duration': ['p(95)<300', 'p(99)<500'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';
const BRANCHES = ['branch-1', 'branch-2', 'branch-3', 'branch-4', 'branch-5'];
const MENU_ITEMS = [
  { id: 'item_1', price: 12.99 },
  { id: 'item_2', price: 8.99 },
  { id: 'item_3', price: 10.99 },
];

function getRandomBranch() {
  return BRANCHES[Math.floor(Math.random() * BRANCHES.length)];
}

function getRandomCustomerId() {
  return `customer_${Math.floor(Math.random() * 5000)}`;
}

function getRandomMenuItems() {
  const count = Math.floor(Math.random() * 3) + 1;
  const items = [];
  for (let i = 0; i < count; i++) {
    const item = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
    items.push({
      menuItemId: item.id,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: item.price,
    });
  }
  return items;
}

// ===== MAIN TEST =====
export default function () {
  const branchId = getRandomBranch();
  const customerId = getRandomCustomerId();

  group('Order Lifecycle', () => {
    // Create order
    group('Create Order', () => {
      const orderPayload = JSON.stringify({
        branchId,
        customerId,
        items: getRandomMenuItems(),
        deliveryType: Math.random() > 0.4 ? 'delivery' : 'pickup',
        paymentMethod: Math.random() > 0.5 ? 'cash' : 'card',
        subtotal: 25.00,
        tax: 2.00,
        deliveryFee: Math.random() > 0.4 ? 2.50 : 0,
        total: 29.50,
      });

      const params = {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'OrderCreation' },
      };

      const start = new Date();
      const res = http.post(`${BASE_URL}/api/v1/orders`, orderPayload, params);
      const duration = (new Date() - start);

      const success = check(res, {
        'order creation success (200/201)': (r) => r.status === 200 || r.status === 201,
      });

      orderCreationLatency.add(duration);
      if (success) {
        successfulOrders.add(1);
        activeOrders.add(1);
      } else {
        failedOrders.add(1);
        errorRate.add(1);
      }

      sleep(0.5);
    });

    // Update order status
    group('Update Order Status', () => {
      const orderId = `order_${Math.floor(Math.random() * 50000)}`;
      const statusPayload = JSON.stringify({
        status: ['confirmed', 'preparing', 'ready'][Math.floor(Math.random() * 3)],
      });

      const params = {
        headers: { 'Content-Type': 'application/json' },
      };

      const start = new Date();
      const res = http.patch(`${BASE_URL}/api/v1/orders/${orderId}/status`, statusPayload, params);
      const duration = (new Date() - start);

      check(res, {
        'status update success or not found': (r) => r.status === 200 || r.status === 404,
      });

      orderUpdateLatency.add(duration);
      if (res.status !== 200 && res.status !== 404) {
        errorRate.add(1);
      }

      activeOrders.add(-1);
      sleep(0.3);
    });

    // Track order
    group('Track Order', () => {
      const orderId = `order_${Math.floor(Math.random() * 50000)}`;

      const start = new Date();
      const res = http.get(`${BASE_URL}/api/v1/orders/${orderId}/track`, {
        tags: { name: 'OrderTracking' },
      });
      const duration = (new Date() - start);

      check(res, {
        'tracking success or not found': (r) => r.status === 200 || r.status === 404,
      });

      orderTrackingLatency.add(duration);
      sleep(0.5);
    });
  });

  sleep(Math.random() * 2 + 0.5);
}
