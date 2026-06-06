import {
  getOverviewStats,
  getDailyOrders,
  getBranchPerformance,
  getDriverPerformanceSummary
} from '../../services/analytics/analytics.service.js';
import redis from '../../services/redis.js';

export async function overview(req, res) {
  try {
    const cacheKey = 'analytics_overview';
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) return res.json(JSON.parse(cached));
    }

    const stats = await getOverviewStats();

    if (redis) {
      await redis.set(cacheKey, JSON.stringify(stats), 'EX', 60);
    }

    res.json(stats);
  } catch (e) {
    console.error('Analytics overview error:', e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function dailyOrders(req, res) {
  const data = await getDailyOrders();
  res.json(data);
}

export async function branchPerformance(req, res) {
  const data = await getBranchPerformance();
  res.json(data);
}

export async function driverPerformance(req, res) {
  const data = await getDriverPerformanceSummary();
  res.json(data);
}
