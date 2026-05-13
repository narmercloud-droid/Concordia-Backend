import { prisma } from "../prisma/client.js";
import { forecastingService } from "./forecasting.service";
import { ltvChurnService } from "./ltvChurn.service";
import { behaviorPredictionService } from "./behaviorPrediction.service";
export class OptimizationLoopService {
    async log(branchId, module, parameter, oldValue, newValue, reason) {
        await prisma.optimizationLog.create({
            data: { branchId, module, parameter, oldValue, newValue, reason },
        });
    }
    // 1. Adjust forecasting weight based on accuracy
    async optimizeForecasting(branchId) {
        try {
            const params = await prisma.optimizationParameters.findUnique({ where: { branchId } });
            if (!params)
                throw new Error("Missing optimization parameters");
            const forecast = await forecastingService.forecastNext7Days(branchId);
            const actual = await prisma.order.count({
                where: {
                    branchId,
                    createdAt: { gte: new Date(Date.now() - 7 * 24 * 3600 * 1000) },
                },
            });
            const predicted = forecast.reduce((a, b) => a + b.expectedOrders, 0);
            const error = Math.abs(predicted - actual) / (actual || 1);
            let newWeight = params.forecastWeight;
            if (error > 0.5)
                newWeight *= 0.9;
            if (error < 0.2)
                newWeight *= 1.1;
            newWeight = Number(newWeight.toFixed(2));
            if (newWeight !== params.forecastWeight) {
                await this.log(branchId, "forecasting", "forecastWeight", params.forecastWeight, newWeight, "Adjusted based on accuracy");
                await prisma.optimizationParameters.update({
                    where: { branchId },
                    data: { forecastWeight: newWeight },
                });
            }
            return { old: params.forecastWeight, new: newWeight };
        }
        catch (err) {
            console.error("OptimizationLoopService optimizeForecasting error:", err);
            throw new Error("Forecasting optimization failed");
        }
    }
    // 2. Adjust churn threshold based on outcomes
    async optimizeChurn(branchId) {
        try {
            const params = await prisma.optimizationParameters.findUnique({ where: { branchId } });
            if (!params)
                throw new Error("Missing optimization parameters");
            // Batch customer set from branch orders (Customer has no branchId in schema)
            const orderCustomers = await prisma.order.findMany({
                where: { branchId, customerId: { not: null } },
                select: { customerId: true },
                distinct: ["customerId"],
            });
            const customerIds = orderCustomers.map(o => o.customerId).filter(Boolean);
            // Batch actual churn computation: orders per customer in last 30 days (branch-scoped)
            const windowStart = new Date(Date.now() - 30 * 24 * 3600 * 1000);
            const actualOrderCounts = await prisma.order.groupBy({
                by: ["customerId"],
                where: {
                    branchId,
                    customerId: { not: null },
                    createdAt: { gte: windowStart },
                },
                _count: { customerId: true },
            });
            const actualOrderCountByCustomerId = new Map(actualOrderCounts.map(g => [g.customerId, g._count.customerId]));
            let correct = 0;
            let total = 0;
            for (const customerId of customerIds) {
                // Predicted churn from branch-scoped churnRisk
                const churn = await ltvChurnService.churnRisk(customerId, branchId);
                const actuallyChurned = (actualOrderCountByCustomerId.get(customerId) ?? 0) === 0;
                // FIX: explicit precedence-safe boolean
                const predictedChurn = (churn.score / 100) > params.churnThreshold;
                if (predictedChurn === actuallyChurned) {
                    correct++;
                }
                total++;
            }
            const accuracy = correct / (total || 1);
            let newThreshold = params.churnThreshold;
            if (accuracy < 0.6)
                newThreshold -= 0.05;
            if (accuracy > 0.8)
                newThreshold += 0.05;
            newThreshold = Math.min(0.9, Math.max(0.1, Number(newThreshold.toFixed(2))));
            if (newThreshold !== params.churnThreshold) {
                await this.log(branchId, "churn", "churnThreshold", params.churnThreshold, newThreshold, "Adjusted based on accuracy");
                await prisma.optimizationParameters.update({
                    where: { branchId },
                    data: { churnThreshold: newThreshold },
                });
            }
            return { old: params.churnThreshold, new: newThreshold };
        }
        catch (err) {
            console.error("OptimizationLoopService optimizeChurn error:", err);
            throw new Error("Churn optimization failed");
        }
    }
    // 3. Adjust behavior prediction confidence
    async optimizeBehavior(branchId) {
        try {
            const params = await prisma.optimizationParameters.findUnique({ where: { branchId } });
            if (!params)
                throw new Error("Missing optimization parameters");
            const customers = await prisma.customer.findMany();
            let correct = 0;
            let total = 0;
            for (const c of customers) {
                const prediction = await behaviorPredictionService.nextOrder(c.id);
                if (!prediction.itemId)
                    continue;
                // OrderItem has no createdAt in schema. Order has createdAt -> order by order.createdAt.
                const lastOrderItem = await prisma.orderItem.findFirst({
                    where: { order: { customerId: c.id } },
                    orderBy: { order: { createdAt: "desc" } },
                    select: { itemId: true },
                });
                if (!lastOrderItem)
                    continue;
                if (lastOrderItem.itemId === prediction.itemId)
                    correct++;
                total++;
            }
            const accuracy = correct / (total || 1);
            let newConfidence = params.behaviorConfidence;
            if (accuracy < 0.5)
                newConfidence -= 0.05;
            if (accuracy > 0.8)
                newConfidence += 0.05;
            newConfidence = Math.min(0.95, Math.max(0.5, Number(newConfidence.toFixed(2))));
            if (newConfidence !== params.behaviorConfidence) {
                await this.log(branchId, "behavior", "behaviorConfidence", params.behaviorConfidence, newConfidence, "Adjusted based on accuracy");
                await prisma.optimizationParameters.update({
                    where: { branchId },
                    data: { behaviorConfidence: newConfidence },
                });
            }
            return { old: params.behaviorConfidence, new: newConfidence };
        }
        catch (err) {
            console.error("OptimizationLoopService optimizeBehavior error:", err);
            throw new Error("Behavior optimization failed");
        }
    }
    // 4. Full optimization cycle
    async run(branchId) {
        try {
            return {
                forecasting: await this.optimizeForecasting(branchId),
                churn: await this.optimizeChurn(branchId),
                behavior: await this.optimizeBehavior(branchId),
            };
        }
        catch (err) {
            console.error("OptimizationLoopService run error:", err);
            throw new Error("Optimization loop failed");
        }
    }
}
export const optimizationLoopService = new OptimizationLoopService();
