/**
 * Churn Prediction Model
 * Uses simple heuristics for churn risk prediction
 */

interface CustomerStats {
  totalOrders: number;
  totalSpend: number;
  avgOrderValue: number;
  lastOrderDate?: Date;
  churnRiskScore?: number;
}

export class ChurnModel {
  /**
   * Predict churn risk based on customer statistics
   * Uses weighted averages and exponential smoothing
   */
  static predictChurnRisk(customerStats: CustomerStats): number {
    const { totalOrders, totalSpend, lastOrderDate } = customerStats;

    // Base risk factors
    let riskScore = 0;

    // Factor 1: Days since last order
    if (lastOrderDate) {
      const daysSinceLastOrder = Math.floor(
        (new Date().getTime() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Exponential increase in risk with days since last order
      const daysRisk = Math.min(1, daysSinceLastOrder / 30);
      riskScore += daysRisk * 0.4; // 40% weight
    }

    // Factor 2: Order frequency
    if (totalOrders < 3) {
      riskScore += 0.3; // New customers have higher risk
    } else if (totalOrders > 10) {
      riskScore -= 0.1; // Loyal customers have lower risk
    }

    // Factor 3: Average order value
    if (customerStats.avgOrderValue < 10) {
      riskScore += 0.2; // Low-value customers may be less loyal
    }

    // Factor 4: Total spend
    if (totalSpend < 50) {
      riskScore += 0.1; // Low total spend indicates less engagement
    }

    // Normalize to 0-1 range
    riskScore = Math.max(0, Math.min(1, riskScore));

    return riskScore;
  }

  /**
   * Get churn risk level
   */
  static getRiskLevel(riskScore: number): string {
    if (riskScore < 0.3) return "low";
    if (riskScore < 0.6) return "medium";
    if (riskScore < 0.8) return "high";
    return "extreme";
  }

  /**
   * Calculate retention probability
   */
  static calculateRetentionProbability(customerStats: CustomerStats): number {
    const churnRisk = this.predictChurnRisk(customerStats);
    return 1 - churnRisk;
  }
}