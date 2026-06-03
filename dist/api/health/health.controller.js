import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function health(req, res) {
    try {
        await prisma.$queryRaw `SELECT 1`;
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString()
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Database unreachable',
            error: err.message
        });
    }
}
export async function deepHealth(req, res) {
    const checks = {};
    try {
        await prisma.$queryRaw `SELECT 1`;
        checks.database = 'ok';
    }
    catch {
        checks.database = 'error';
    }
    checks.redis = process.env.REDIS_URL?.startsWith('redis://')
        ? 'configured'
        : 'not_configured';
    checks.push = process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY
        ? 'configured'
        : 'not_configured';
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        checks
    });
}
