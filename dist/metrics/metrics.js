import client from "prom-client";
const { Gauge, Counter, Histogram } = client;
const register = client.register;
// Prevent duplicate default metrics registration
if (!register.getSingleMetric("nodejs_active_handles")) {
    client.collectDefaultMetrics({ register });
}
// ===== HTTP METRICS =====
// HTTP request duration histogram
export const httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5, 10]
});
// API latency histogram for request processing separate from transport
export const apiRequestDuration = new Histogram({
    name: 'api_request_duration_seconds',
    help: 'Duration of API request processing in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});
export const apiRouteLatency = new Histogram({
    name: 'api_route_latency_seconds',
    help: 'Controller and route latency in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.25, 0.5, 1, 2]
});
// API route total counter
export const apiRouteTotal = new Counter({
    name: 'api_route_total',
    help: 'Total number of API requests per route',
    labelNames: ['method', 'route', 'status_code']
});
// API route errors counter
export const apiRouteErrors = new Counter({
    name: 'api_route_errors_total',
    help: 'Total number of API route errors',
    labelNames: ['method', 'route', 'error_type']
});
export const apiCacheHitRatio = new Histogram({
    name: 'api_cache_hit_ratio',
    help: 'Ratio of cache hits to requests for API routes',
    labelNames: ['route'],
    buckets: [0, 0.25, 0.5, 0.75, 1]
});
export const apiRateLimitHits = new Counter({
    name: 'api_rate_limit_hits_total',
    help: 'Total API rate limit violations',
    labelNames: ['route', 'ip', 'branch_id']
});
export const apiCacheHits = new Counter({
    name: 'api_cache_hits_total',
    help: 'Total API cache hits',
    labelNames: ['route']
});
export const apiCacheMisses = new Counter({
    name: 'api_cache_misses_total',
    help: 'Total API cache misses',
    labelNames: ['route']
});
// ===== DATABASE METRICS =====
// Database query duration histogram
export const prismaQueryDuration = new Histogram({
    name: 'prisma_query_duration_seconds',
    help: 'Duration of Prisma database queries in seconds',
    labelNames: ['operation', 'model'],
    buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1, 2]
});
// Database connection pool metrics
export const dbConnections = new Gauge({
    name: 'database_connections_active',
    help: 'Number of active database connections'
});
export const dbConnectionErrors = new Counter({
    name: 'database_connection_errors_total',
    help: 'Total database connection errors'
});
// Prisma query total counter
export const prismaQueryTotal = new Counter({
    name: 'prisma_query_total',
    help: 'Total number of Prisma queries',
    labelNames: ['operation', 'model']
});
// Prisma query errors counter
export const prismaQueryErrors = new Counter({
    name: 'prisma_query_errors_total',
    help: 'Total number of Prisma query errors',
    labelNames: ['operation', 'model', 'error_type']
});
// ===== REDIS METRICS =====
// Redis operation latency histogram
export const redisLatency = new Histogram({
    name: 'redis_latency_seconds',
    help: 'Latency of Redis operations in seconds',
    labelNames: ['operation'],
    buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1]
});
// Redis operations counter
export const redisOperations = new Counter({
    name: 'redis_operations_total',
    help: 'Total Redis operations',
    labelNames: ['operation', 'status']
});
// Redis cache hit rate
export const redisCacheHits = new Counter({
    name: 'redis_cache_hits_total',
    help: 'Total Redis cache hits',
    labelNames: ['key_pattern']
});
// Redis operation errors counter
export const redisOperationErrors = new Counter({
    name: 'redis_operation_errors_total',
    help: 'Total Redis operation errors',
    labelNames: ['operation', 'error_type']
});
// ===== SOCKET METRICS =====
// Active socket connections gauge
export const activeSockets = new Gauge({
    name: 'active_sockets_total',
    help: 'Number of active socket connections',
    labelNames: ['namespace']
});
// Socket emit latency histogram
export const socketEmitLatency = new Histogram({
    name: 'socket_emit_latency_seconds',
    help: 'Latency of socket emit operations in seconds',
    labelNames: ['event'],
    buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1]
});
// Socket disconnections counter
export const socketDisconnections = new Counter({
    name: 'socket_disconnections_total',
    help: 'Total socket disconnections',
    labelNames: ['namespace', 'reason']
});
// Socket broadcast latency histogram
export const socketBroadcastLatency = new Histogram({
    name: 'socket_broadcast_latency_seconds',
    help: 'Latency of socket broadcast operations in seconds',
    labelNames: ['event', 'namespace'],
    buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1]
});
// Socket connection duration histogram
export const socketConnectionDuration = new Histogram({
    name: 'socket_connection_duration_seconds',
    help: 'Duration of socket connections in seconds',
    labelNames: ['namespace'],
    buckets: [1, 5, 10, 30, 60, 300, 600, 1800]
});
// Socket rate limit hits counter
export const socketRateLimitHits = new Counter({
    name: 'socket_rate_limit_hits_total',
    help: 'Total socket rate limit violations',
    labelNames: ['namespace', 'socket_id']
});
// Socket disconnect reason gauge
export const socketDisconnectReason = new Counter({
    name: 'socket_disconnect_reasons_total',
    help: 'Socket disconnect reasons',
    labelNames: ['namespace', 'reason']
});
// Socket throttled events counter
export const socketThrottledEvents = new Counter({
    name: 'socket_throttled_events_total',
    help: 'Total throttled socket events',
    labelNames: ['event', 'namespace']
});
// Socket buffer size gauge
export const socketBufferSize = new Gauge({
    name: 'socket_buffer_size_bytes',
    help: 'Current socket buffer size',
    labelNames: ['socket_id', 'namespace']
});
// Socket room count gauge
export const socketRoomCount = new Gauge({
    name: 'socket_rooms_total',
    help: 'Total number of active rooms',
    labelNames: ['namespace']
});
// Socket connections per IP gauge
export const socketConnectionsPerIP = new Gauge({
    name: 'socket_connections_per_ip',
    help: 'Number of socket connections per IP',
    labelNames: ['ip']
});
// ===== AI METRICS =====
// AI prediction latency histogram
export const aiPredictionLatency = new Histogram({
    name: 'ai_prediction_latency_seconds',
    help: 'Latency of AI predictions in seconds',
    labelNames: ['prediction_type'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});
// AI prediction errors counter
export const aiPredictionErrors = new Counter({
    name: 'ai_prediction_errors_total',
    help: 'Total AI prediction errors',
    labelNames: ['prediction_type']
});
// AI prediction total counter
export const aiPredictionTotal = new Counter({
    name: 'ai_prediction_total',
    help: 'Total number of AI predictions',
    labelNames: ['prediction_type']
});
// AI prediction cache hits counter
export const aiPredictionCacheHits = new Counter({
    name: 'ai_prediction_cache_hits_total',
    help: 'Total AI prediction cache hits',
    labelNames: ['prediction_type']
});
// AI prediction cache misses counter
export const aiPredictionCacheMisses = new Counter({
    name: 'ai_prediction_cache_misses_total',
    help: 'Total AI prediction cache misses',
    labelNames: ['prediction_type']
});
// ===== NODEJS RESOURCE METRICS =====
// Event loop lag gauge
export const nodejsEventLoopLag = new Gauge({
    name: 'nodejs_event_loop_lag_seconds',
    help: 'Event loop lag in seconds',
});
// Memory usage gauge
export const nodejsMemoryUsage = new Gauge({
    name: 'nodejs_memory_usage_bytes',
    help: 'Node.js memory usage in bytes',
    labelNames: ['type']
});
// ===== BUSINESS METRICS =====
// Branch order count counter
export const branchOrderCount = new Counter({
    name: 'branch_orders_total',
    help: 'Total number of orders per branch',
    labelNames: ['branch_id', 'status']
});
// Order lifecycle timing
export const orderLifecycleDuration = new Histogram({
    name: 'order_lifecycle_duration_seconds',
    help: 'Time spent in different order lifecycle stages',
    labelNames: ['stage'],
    buckets: [30, 60, 120, 300, 600, 1800] // 30s to 30min
});
// Delivery metrics
export const deliveryDuration = new Histogram({
    name: 'delivery_duration_seconds',
    help: 'Duration of deliveries in seconds',
    labelNames: ['branch_id'],
    buckets: [60, 300, 600, 1200, 1800, 3600] // 1min to 1hour
});
// ===== BRANCH-LEVEL PERFORMANCE METRICS =====
// Active orders per branch gauge
export const branchActiveOrders = new Gauge({
    name: 'branch_active_orders',
    help: 'Number of active orders per branch',
    labelNames: ['branch_id']
});
// Active couriers per branch gauge
export const branchActiveCouriers = new Gauge({
    name: 'branch_active_couriers',
    help: 'Number of active couriers per branch',
    labelNames: ['branch_id']
});
// Socket connections per branch gauge
export const branchSocketConnections = new Gauge({
    name: 'branch_socket_connections',
    help: 'Number of active socket connections per branch',
    labelNames: ['branch_id']
});
// AI latency average per branch gauge
export const branchAILatencyAvg = new Gauge({
    name: 'branch_ai_latency_avg',
    help: 'Average AI prediction latency per branch in seconds',
    labelNames: ['branch_id']
});
// ===== MIDDLEWARE AND TRACKING =====
// Metrics middleware
export const metricsMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000; // Convert to seconds
        const route = req.route?.path || req.url;
        httpRequestDuration
            .labels(req.method, route, res.statusCode.toString())
            .observe(duration);
    });
    next();
};
// Database query tracking
export const trackDatabaseQuery = (operation, model, duration) => {
    prismaQueryDuration.labels(operation, model).observe(duration);
    prismaQueryTotal.labels(operation, model).inc();
};
// Database query error tracking
export const trackDatabaseQueryError = (operation, model, errorType) => {
    prismaQueryErrors.labels(operation, model, errorType).inc();
};
// Redis operation tracking
export const trackRedisOperation = (operation, duration, success) => {
    redisLatency.labels(operation).observe(duration);
    redisOperations.labels(operation, success ? 'success' : 'error').inc();
};
// Redis operation error tracking
export const trackRedisOperationError = (operation, errorType) => {
    redisOperationErrors.labels(operation, errorType).inc();
};
// Redis cache hit tracking
export const trackCacheHit = (keyPattern) => {
    redisCacheHits.labels(keyPattern).inc();
};
export const trackApiCacheHit = (route) => {
    apiCacheHits.labels(route).inc();
    apiCacheHitRatio.labels(route).observe(1);
};
export const trackApiCacheMiss = (route) => {
    apiCacheMisses.labels(route).inc();
    apiCacheHitRatio.labels(route).observe(0);
};
export const trackApiRateLimitHit = (route, ip, branchId) => {
    apiRateLimitHits.labels(route, ip || 'unknown', branchId).inc();
};
// Track API route request
export const trackApiRoute = (method, route, statusCode) => {
    apiRouteTotal.labels(method, route, statusCode.toString()).inc();
};
// Track API route error
export const trackApiRouteError = (method, route, errorType) => {
    apiRouteErrors.labels(method, route, errorType).inc();
};
// Update active sockets count
export const updateActiveSockets = (namespace, count) => {
    activeSockets.labels(namespace).set(count);
};
// Track socket emit latency
export const trackSocketEmit = (event, duration) => {
    socketEmitLatency.labels(event).observe(duration);
};
// Track socket broadcast latency
export const trackSocketBroadcast = (event, namespace, duration) => {
    socketBroadcastLatency.labels(event, namespace).observe(duration);
};
// Track socket connection duration
export const trackSocketConnectionDuration = (namespace, duration) => {
    socketConnectionDuration.labels(namespace).observe(duration);
};
// Track socket disconnect
export const trackSocketDisconnection = (namespace, reason) => {
    socketDisconnections.labels(namespace, reason).inc();
    socketDisconnectReason.labels(namespace, reason).inc();
};
// Track rate limit hit
export const trackSocketRateLimitHit = (namespace, socketId) => {
    socketRateLimitHits.labels(namespace, socketId).inc();
};
// Track throttled event
export const trackSocketThrottledEvent = (event, namespace) => {
    socketThrottledEvents.labels(event, namespace).inc();
};
// Update socket buffer size
export const updateSocketBufferSize = (socketId, namespace, size) => {
    socketBufferSize.labels(socketId, namespace).set(size);
};
// Update room count
export const updateSocketRoomCount = (namespace, count) => {
    socketRoomCount.labels(namespace).set(count);
};
// Update connections per IP
export const updateSocketConnectionsPerIP = (ip, count) => {
    if (count > 0) {
        socketConnectionsPerIP.labels(ip).set(count);
    }
};
// Record branch order
export const recordBranchOrder = (branchId, status) => {
    branchOrderCount.labels(branchId, status).inc();
};
// Record AI prediction latency
export const recordAIPredictionLatency = (type, duration) => {
    aiPredictionLatency.labels(type).observe(duration);
    aiPredictionTotal.labels(type).inc();
};
// Record AI prediction error
export const recordAIPredictionError = (type) => {
    aiPredictionErrors.labels(type).inc();
};
// Record AI prediction cache hit
export const recordAIPredictionCacheHit = (type) => {
    aiPredictionCacheHits.labels(type).inc();
};
// Record AI prediction cache miss
export const recordAIPredictionCacheMiss = (type) => {
    aiPredictionCacheMisses.labels(type).inc();
};
// Record order lifecycle timing
export const recordOrderLifecycleTiming = (stage, duration) => {
    orderLifecycleDuration.labels(stage).observe(duration);
};
// Record delivery duration
export const recordDeliveryDuration = (branchId, duration) => {
    deliveryDuration.labels(branchId).observe(duration);
};
// Update branch active orders gauge
export const updateBranchActiveOrders = (branchId, count) => {
    branchActiveOrders.labels(branchId).set(count);
};
// Update branch active couriers gauge
export const updateBranchActiveCouriers = (branchId, count) => {
    branchActiveCouriers.labels(branchId).set(count);
};
// Update branch socket connections gauge
export const updateBranchSocketConnections = (branchId, count) => {
    branchSocketConnections.labels(branchId).set(count);
};
// Update branch AI latency average gauge
export const updateBranchAILatencyAvg = (branchId, avgLatency) => {
    branchAILatencyAvg.labels(branchId).set(avgLatency);
};
// Sample Node.js resource metrics
export const sampleNodejsResources = () => {
    try {
        const memUsage = process.memoryUsage();
        nodejsMemoryUsage.labels('heapUsed').set(memUsage.heapUsed);
        nodejsMemoryUsage.labels('heapTotal').set(memUsage.heapTotal);
        nodejsMemoryUsage.labels('external').set(memUsage.external);
        nodejsMemoryUsage.labels('rss').set(memUsage.rss);
        // active handles and requests are exposed by prom-client default metrics
    }
    catch (error) {
        console.error("Error sampling Node.js resources:", error);
    }
};
// Start periodic resource sampling
export const startResourceSampling = () => {
    setInterval(sampleNodejsResources, 5000); // Sample every 5 seconds
};
// Get metrics for Prometheus scraping
export const getMetrics = async () => {
    return register.metrics();
};
// Register metrics endpoint handler
export const metricsHandler = async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        const metrics = await getMetrics();
        res.end(metrics);
    }
    catch (error) {
        res.status(500).end('Error generating metrics');
    }
};
