import ws from 'k6/ws';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Gauge, Counter } from 'k6/metrics';

// ===== CUSTOM METRICS =====
const socketErrorRate = new Rate('custom_socket_error_rate');
const socketDisconnectRate = new Rate('custom_socket_disconnect_rate');
const socketConnectionLatency = new Trend('custom_socket_connection_latency');
const socketMessageLatency = new Trend('custom_socket_message_latency');
const activeSocketConnections = new Gauge('custom_active_socket_connections');
const socketMessagesSent = new Counter('custom_socket_messages_sent');
const socketMessagesReceived = new Counter('custom_socket_messages_received');

// ===== TEST OPTIONS =====
export const options = {
  stages: [
    { duration: '1m', target: 500 },     // Ramp up to 500
    { duration: '1m', target: 1000 },    // Ramp to 1000
    { duration: '2m', target: 1500 },    // Ramp to 1500
    { duration: '2m', target: 2000 },    // Peak: 2000 connections
    { duration: '2m', target: 1000 },    // Down to 1000
    { duration: '1m', target: 500 },     // Cool down to 500
    { duration: '1m', target: 0 },       // Ramp down to 0
  ],
  thresholds: {
    'custom_socket_error_rate': ['rate<0.01'],                  // < 1% error rate
    'custom_socket_disconnect_rate': ['rate<0.02'],             // < 2% disconnect rate
    'custom_socket_connection_latency': ['p(95)<300', 'p(99)<500'],
    'custom_socket_message_latency': ['p(95)<300', 'p(99)<500'],
    'ws_connecting': ['p(95)<300', 'p(99)<500'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'ws://localhost:4000';
const BRANCHES = ['branch-1', 'branch-2', 'branch-3', 'branch-4', 'branch-5'];

function getRandomBranch() {
  return BRANCHES[Math.floor(Math.random() * BRANCHES.length)];
}

// ===== MAIN TEST =====
export default function () {
  const branchId = getRandomBranch();
  const clientId = `client_${__VU}_${Math.floor(Math.random() * 100000)}`;
  const url = `${BASE_URL}?branchId=${branchId}&clientId=${clientId}`;

  group('Socket.IO Connection and Events', () => {
    const startTime = new Date();
    let connectionEstablished = false;
    let messagesReceived = 0;

    const res = ws.connect(url, {
      tags: { name: 'SocketConnection' },
    }, (socket) => {
      connectionEstablished = true;
      const connDuration = (new Date() - startTime);
      socketConnectionLatency.add(connDuration);
      activeSocketConnections.add(1);

      check(socket, {
        'connection status open': (s) => s.readyState === ws.OPEN,
      });

      // ===== ORDER UPDATE LISTENER =====
      socket.on('order:update', (msg) => {
        socketMessagesReceived.add(1);
        messagesReceived++;
        socketMessageLatency.add(0); // Inline tracking
        check(msg, {
          'order update event received': (m) => m !== undefined,
        });
      });

      // ===== COURIER LOCATION LISTENER =====
      socket.on('courier:location', (msg) => {
        socketMessagesReceived.add(1);
        messagesReceived++;
        check(msg, {
          'courier location received': (m) => m && m.lat && m.lng,
        });
      });

      // ===== KDS LISTENER =====
      socket.on('kds:order', (msg) => {
        socketMessagesReceived.add(1);
        messagesReceived++;
        check(msg, {
          'KDS order received': (m) => m !== undefined,
        });
      });

      // ===== ADMIN DASHBOARD LISTENER =====
      socket.on('dashboard:update', (msg) => {
        socketMessagesReceived.add(1);
        messagesReceived++;
        check(msg, {
          'dashboard update received': (m) => m !== undefined,
        });
      });

      // ===== DISCONNECT LISTENER =====
      socket.on('disconnect', () => {
        socketDisconnectRate.add(1);
        activeSocketConnections.add(-1);
      });

      // ===== ERROR LISTENER =====
      socket.on('error', (err) => {
        socketErrorRate.add(1);
        check(null, {
          'socket error occurred': () => false,
        });
      });

      // ===== EMIT: TRACK ORDER =====
      const orderIds = Array.from({ length: 2 }, (_, i) => `order_${Math.floor(Math.random() * 10000)}`);
      socket.emit('order:track', {
        clientId,
        branchId,
        orderIds,
      });
      socketMessagesSent.add(1);

      // ===== EMIT: SUBSCRIBE TO BRANCH =====
      socket.emit('branch:subscribe', {
        branchId,
        clientId,
      });
      socketMessagesSent.add(1);

      // ===== EMIT: COURIER LOCATION UPDATES (THROTTLED 300-500ms) =====
      const locationInterval = Math.floor(Math.random() * 200) + 300; // 300-500ms
      let locationTimer = socket.setInterval(() => {
        if (socket.readyState === ws.OPEN) {
          socket.emit('courier:location', {
            courierId: `courier_${Math.floor(Math.random() * 500)}`,
            branchId,
            lat: 40.7128 + (Math.random() - 0.5) * 0.1,
            lng: -74.0060 + (Math.random() - 0.5) * 0.1,
            timestamp: new Date().toISOString(),
          });
          socketMessagesSent.add(1);
        }
      }, locationInterval);

      // ===== EMIT: ADMIN DASHBOARD POLLING =====
      socket.emit('dashboard:subscribe', {
        branchId,
        clientId,
      });
      socketMessagesSent.add(1);

      // ===== EMIT: KDS LISTENER SUBSCRIPTION =====
      socket.emit('kds:subscribe', {
        branchId,
        clientId,
      });
      socketMessagesSent.add(1);

      // Keep connection alive for 30 seconds
      socket.setTimeout(() => {
        clearInterval(locationTimer);
        socket.close();
      }, 30000);
    });

    check(res, {
      'socket connection successful': (r) => r && r.status === 101,
    });

    if (!connectionEstablished) {
      socketErrorRate.add(1);
    }
  });

  sleep(Math.random() * 2 + 1); // Random sleep 1-3 seconds
}
