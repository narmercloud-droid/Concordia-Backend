/**
 * Lifetime Value Prediction Model
 * Uses simple heuristics for LTV prediction
 */
export class LTVModel {
    /**
     * Predict lifetime value based on customer statistics
     * Uses weighted averages and retention multipliers
     */
    static predictLifetimeValue(customerStats) {
        const { totalOrders, totalSpend, avgOrderValue, lastOrderDate } = customerStats;
        // Base LTV calculation
        let ltv = totalSpend;
        // Factor 1: Order frequency multiplier
        let frequencyMultiplier = 1.0;
        if (totalOrders > 20) {
            frequencyMultiplier = 1.5; // Very frequent customers
        }
        else if (totalOrders > 10) {
            frequencyMultiplier = 1.3; // Frequent customers
        }
        else if (totalOrders > 5) {
            frequencyMultiplier = 1.1; // Regular customers
        }
        else if (totalOrders < 3) {
            frequencyMultiplier = 0.8; // New customers
        }
        // Factor 2: Recency multiplier
        let recencyMultiplier = 1.0;
        if (lastOrderDate) {
            const daysSinceLastOrder = Math.floor((new Date().getTime() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24));
            if (daysSinceLastOrder < 7) {
                recencyMultiplier = 1.2; // Very recent customers
            }
            else if (daysSinceLastOrder < 30) {
                recencyMultiplier = 1.0; // Recent customers
            }
            else if (daysSinceLastOrder < 90) {
                recencyMultiplier = 0.9; // Somewhat recent customers
            }
            else {
                recencyMultiplier = 0.7; // Inactive customers
            }
        }
        // Factor 3: Average order value multiplier
        let aovMultiplier = 1.0;
        if (avgOrderValue > 50) {
            aovMultiplier = 1.3; // High-value customers
        }
        else if (avgOrderValue > 25) {
            aovMultiplier = 1.1; // Medium-value customers
        }
        else if (avgOrderValue < 10) {
            aovMultiplier = 0.9; // Low-value customers
        }
        // Apply multipliers
        ltv = ltv * frequencyMultiplier * recencyMultiplier * aovMultiplier;
        // Add projected future value
        const projectedOrders = Math.max(0, 12 - totalOrders); // Project 12 months
        const projectedValue = projectedOrders * avgOrderValue * 0.5; // 50% retention rate
        ltv += projectedValue;
        return Math.max(0, ltv);
    }
    /**
     * Get LTV tier
     */
    static getLTVTier(ltv) {
        if (ltv < 50)
            return "bronze";
        if (ltv < 200)
            return "silver";
        if (ltv < 500)
            return "gold";
        return "platinum";
    }
    /**
     * Calculate projected LTV for next 12 months
     */
    static projectFutureLTV(customerStats, months = 12) {
        const currentLTV = this.predictLifetimeValue(customerStats);
        const monthlyGrowthRate = 0.05; // 5% monthly growth
        const projectedLTV = currentLTV * Math.pow(1 + monthlyGrowthRate, months);
        return projectedLTV;
    }
}
