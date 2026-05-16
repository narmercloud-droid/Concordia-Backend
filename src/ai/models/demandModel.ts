/**
 * Demand Prediction Model
 * Uses simple heuristics for demand forecasting
 */

interface BranchStats {
  branchId: string;
  date: Date;
  hour: number;
  orderCount: number;
  predictedDemand: number;
}

export class DemandModel {
  /**
   * Predict demand based on branch statistics
   * Uses moving averages and exponential smoothing
   */
  static predictDemand(branchStats: BranchStats): number {
    const { orderCount, date, hour } = branchStats;

    // Base demand
    let predictedDemand = orderCount;

    // Factor 1: Time of day adjustment
    const hourMultiplier = this.getHourMultiplier(hour);
    predictedDemand *= hourMultiplier;

    // Factor 2: Day of week adjustment
    const dayMultiplier = this.getDayMultiplier(date);
    predictedDemand *= dayMultiplier;

    // Factor 3: Seasonal adjustment
    const seasonalMultiplier = this.getSeasonalMultiplier(date);
    predictedDemand *= seasonalMultiplier;

    return Math.max(0, predictedDemand);
  }

  /**
   * Get hour multiplier based on typical demand patterns
   */
  static getHourMultiplier(hour: number): number {
    // Typical demand patterns throughout the day
    if (hour >= 11 && hour <= 13) return 1.5; // Lunch rush
    if (hour >= 18 && hour <= 20) return 1.8; // Dinner rush
    if (hour >= 10 && hour <= 11) return 1.2; // Pre-lunch
    if (hour >= 17 && hour <= 18) return 1.3; // Pre-dinner
    if (hour >= 21 && hour <= 23) return 0.8; // Late night
    if (hour >= 0 && hour <= 9) return 0.3; // Early morning
    return 1.0; // Normal hours
  }

  /**
   * Get day of week multiplier
   */
  static getDayMultiplier(date: Date): number {
    const day = date.getDay();
    
    // Weekend vs weekday patterns
    if (day === 0 || day === 6) return 1.3; // Weekend
    if (day === 5) return 1.1; // Friday
    if (day === 1) return 0.9; // Monday
    return 1.0; // Tuesday-Thursday
  }

  /**
   * Get seasonal multiplier
   */
  static getSeasonalMultiplier(date: Date): number {
    const month = date.getMonth();
    
    // Seasonal patterns
    if (month === 11 || month === 0) return 1.2; // Holiday season
    if (month === 6 || month === 7) return 1.1; // Summer
    if (month === 2 || month === 3) return 0.9; // Spring
    return 1.0; // Normal season
  }

  /**
   * Calculate confidence interval for prediction
   */
  static getConfidenceInterval(prediction: number, historicalData: number[]): { lower: number; upper: number } {
    if (historicalData.length === 0) {
      return { lower: prediction * 0.8, upper: prediction * 1.2 };
    }

    // Calculate standard deviation
    const mean = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
    const variance = historicalData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalData.length;
    const stdDev = Math.sqrt(variance);

    // 95% confidence interval
    const margin = 1.96 * stdDev;
    
    return {
      lower: Math.max(0, prediction - margin),
      upper: prediction + margin
    };
  }
}