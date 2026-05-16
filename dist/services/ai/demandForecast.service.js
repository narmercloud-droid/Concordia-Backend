import { prisma } from "../../prisma/client.js";
export class DemandForecastService {
    /**
     * Record branch demand after an order is created
     */
    static async recordBranchDemand(order) {
        const branchId = order.branchId;
        const orderDate = new Date(order.createdAt);
        const hour = orderDate.getHours();
        const startOfDay = new Date(orderDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(orderDate);
        endOfDay.setHours(23, 59, 59, 999);
        // Get existing demand record for this hour
        const existingDemand = await prisma.branchDemand.findFirst({
            where: {
                branchId,
                date: {
                    gte: startOfDay,
                    lt: endOfDay
                },
                hour
            }
        });
        if (existingDemand) {
            // Update existing record
            await prisma.branchDemand.update({
                where: { id: existingDemand.id },
                data: {
                    orderCount: existingDemand.orderCount + 1
                }
            });
        }
        else {
            // Create new record
            await prisma.branchDemand.create({
                data: {
                    branchId,
                    date: startOfDay,
                    hour,
                    orderCount: 1,
                    predictedDemand: 0
                }
            });
        }
    }
    /**
     * Predict demand for a branch at a specific date and hour
     */
    static async predictDemand(branchId, date, hour) {
        // Get historical demand for this hour across similar days
        const targetDay = date.getDay(); // 0 = Sunday, 6 = Saturday
        const startOfDate = new Date(date);
        startOfDate.setHours(0, 0, 0, 0);
        // Get demand for the same hour on similar days (last 4 weeks)
        const historicalData = await prisma.branchDemand.findMany({
            where: {
                branchId,
                hour,
                date: {
                    gte: new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                    lt: date
                }
            },
            orderBy: { date: 'desc' }
        });
        if (historicalData.length === 0) {
            return 0; // No historical data
        }
        // Calculate moving average with exponential smoothing
        const weights = historicalData.map((_, index) => Math.pow(0.7, index));
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        const weightedSum = historicalData.reduce((sum, data, index) => {
            return sum + (data.orderCount * weights[index]);
        }, 0);
        const predictedDemand = weightedSum / totalWeight;
        // Update the prediction in the database
        const endOfDate = new Date(date);
        endOfDate.setHours(23, 59, 59, 999);
        const existingDemand = await prisma.branchDemand.findFirst({
            where: {
                branchId,
                date: {
                    gte: startOfDate,
                    lt: endOfDate
                },
                hour
            }
        });
        if (existingDemand) {
            await prisma.branchDemand.update({
                where: { id: existingDemand.id },
                data: {
                    predictedDemand
                }
            });
        }
        return predictedDemand;
    }
    /**
     * Get demand forecast for next 24 hours
     */
    static async get24HourForecast(branchId) {
        const now = new Date();
        const forecast = [];
        for (let i = 0; i < 24; i++) {
            const futureDate = new Date(now.getTime() + i * 60 * 60 * 1000);
            const hour = futureDate.getHours();
            const predictedDemand = await this.predictDemand(branchId, futureDate, hour);
            forecast.push({
                date: futureDate,
                hour,
                predictedDemand
            });
        }
        return forecast;
    }
    /**
     * Get current demand for a branch
     */
    static async getCurrentDemand(branchId) {
        const now = new Date();
        const hour = now.getHours();
        return prisma.branchDemand.findFirst({
            where: {
                branchId,
                date: {
                    gte: new Date(now.setHours(0, 0, 0, 0)),
                    lt: new Date(now.setHours(23, 59, 59, 999))
                },
                hour
            }
        });
    }
}
