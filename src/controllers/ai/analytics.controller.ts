import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/client.js";
import { success, fail } from "../controllerHelper.js";
import { z } from "zod";
import {
  getChurnPrediction,
  cacheChurnPrediction,
  getTopMenuItems as getCachedTopMenu,
  cacheTopMenuItems,
  getBranchDemandForecast,
  cacheBranchDemandForecast
} from "../../lib/redis.js";

// Validation schemas
const idParamSchema = z.object({
  id: z.string().uuid("Invalid ID format")
});

const branchIdQuerySchema = z.object({
  branchId: z.string().uuid("Invalid branch ID format")
});

const customerIdParamSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID format")
});

export const AnalyticsController = {
  /**
   * GET /ai/customer/:id/churn
   * Get churn risk for a customer
   */
  async getCustomerChurnRisk(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", parsed.error.issues[0].message, 400);
      }

      const { id: customerId } = parsed.data;

      // Validate customer exists
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { id: true }
      });

      if (!customer) {
        return fail(res, "NOT_FOUND", "Customer not found", 404);
      }

      const cachedChurn = await getChurnPrediction(customerId);
      if (cachedChurn) {
        const { ChurnModel } = await import("../../ai/models/churnModel.js");
        return success(res, {
          customerId,
          churnRiskScore: cachedChurn.score,
          riskLevel: ChurnModel.getRiskLevel(cachedChurn.score),
          totalOrders: cachedChurn.totalOrders,
          totalSpend: cachedChurn.totalSpend,
          lastOrderDate: cachedChurn.lastOrderDate
        }, "Customer churn risk retrieved (cached)");
      }

      // Get customer analytics
      const analytics = await prisma.customerAnalytics.findUnique({
        where: { customerId }
      });

      if (!analytics) {
        return success(res, {
          customerId,
          churnRiskScore: 0,
          riskLevel: "low",
          message: "No analytics data available for this customer"
        }, "Customer churn risk retrieved");
      }

      // Import churn model
      const { ChurnModel } = await import("../../ai/models/churnModel.js");
      const churnRisk = ChurnModel.predictChurnRisk({
        totalOrders: analytics.totalOrders,
        totalSpend: analytics.totalSpend,
        avgOrderValue: analytics.avgOrderValue,
        lastOrderDate: analytics.lastOrderDate || undefined
      });

      const riskLevel = ChurnModel.getRiskLevel(churnRisk);
      await cacheChurnPrediction(
        customerId,
        churnRisk,
        analytics.totalOrders,
        analytics.totalSpend,
        analytics.lastOrderDate || null,
        30
      );

      return success(res, {
        customerId,
        churnRiskScore: churnRisk,
        riskLevel,
        totalOrders: analytics.totalOrders,
        totalSpend: analytics.totalSpend,
        lastOrderDate: analytics.lastOrderDate
      }, "Customer churn risk retrieved");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  /**
   * GET /ai/customer/:id/ltv
   * Get lifetime value for a customer
   */
  async getCustomerLTV(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", parsed.error.issues[0].message, 400);
      }

      const { id: customerId } = parsed.data;

      // Validate customer exists
      const customer = await prisma.customer.findUnique({
        where: { id: customerId }
      });

      if (!customer) {
        return fail(res, "NOT_FOUND", "Customer not found", 404);
      }

      // Get customer analytics
      const analytics = await prisma.customerAnalytics.findUnique({
        where: { customerId }
      });

      if (!analytics) {
        return success(res, {
          customerId,
          lifetimeValue: 0,
          ltvTier: "bronze",
          message: "No analytics data available for this customer"
        }, "Customer LTV retrieved");
      }

      // Import LTV model
      const { LTVModel } = await import("../../ai/models/ltvModel.js");
      const ltv = LTVModel.predictLifetimeValue({
        totalOrders: analytics.totalOrders,
        totalSpend: analytics.totalSpend,
        avgOrderValue: analytics.avgOrderValue,
        lastOrderDate: analytics.lastOrderDate || undefined
      });

      const ltvTier = LTVModel.getLTVTier(ltv);
      const projectedLTV = LTVModel.projectFutureLTV({
        totalOrders: analytics.totalOrders,
        totalSpend: analytics.totalSpend,
        avgOrderValue: analytics.avgOrderValue,
        lastOrderDate: analytics.lastOrderDate || undefined
      });

      return success(res, {
        customerId,
        lifetimeValue: ltv,
        ltvTier,
        projectedLTV12Months: projectedLTV,
        totalOrders: analytics.totalOrders,
        totalSpend: analytics.totalSpend
      }, "Customer LTV retrieved");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  /**
   * GET /ai/menu/top
   * Get top menu items
   */
  async getTopMenuItems(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = branchIdQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", parsed.error.issues[0].message, 400);
      }

      const { branchId } = parsed.data;

      // Validate branch exists
      const branch = await prisma.branch.findUnique({
        where: { id: branchId }
      });

      if (!branch) {
        return fail(res, "NOT_FOUND", "Branch not found", 404);
      }

      const cachedTopItems = await getCachedTopMenu(branchId, 10);
      if (cachedTopItems) {
        return success(res, {
          branchId,
          topItems: cachedTopItems
        }, "Top menu items retrieved (cached)");
      }

      // Import menu analytics service
      const { MenuAnalyticsService } = await import("../../services/ai/menuAnalytics.service.js");
      const topItems = await MenuAnalyticsService.getTopItems(branchId, 10);
      await cacheTopMenuItems(branchId, 10, topItems, 30);

      return success(res, {
        branchId,
        topItems
      }, "Top menu items retrieved");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  /**
   * GET /ai/courier/:id/performance
   * Get courier performance
   */
  async getCourierPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", parsed.error.issues[0].message, 400);
      }

      const { id: courierId } = parsed.data;

      // Validate courier exists
      const courier = await prisma.courier.findUnique({
        where: { id: courierId }
      });

      if (!courier) {
        return fail(res, "NOT_FOUND", "Courier not found", 404);
      }

      // Get courier performance
      const performance = await prisma.courierPerformance.findUnique({
        where: { courierId }
      });

      if (!performance) {
        return success(res, {
          courierId,
          performanceScore: 0,
          message: "No performance data available for this courier"
        }, "Courier performance retrieved");
      }

      // Import courier analytics service
      const { CourierAnalyticsService } = await import("../../services/ai/courierAnalytics.service.js");
      const performanceScore = await CourierAnalyticsService.calculateCourierScore(courierId);

      return success(res, {
        courierId,
        performanceScore,
        totalDeliveries: performance.totalDeliveries,
        avgDeliveryTime: performance.avgDeliveryTime,
        onTimeRate: performance.onTimeRate,
        ratingScore: performance.ratingScore
      }, "Courier performance retrieved");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  /**
   * GET /ai/branch/:id/demand
   * Get demand forecast for a branch
   */
  async getBranchDemand(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", parsed.error.issues[0].message, 400);
      }

      const { id: branchId } = parsed.data;

      // Validate branch exists
      const branch = await prisma.branch.findUnique({
        where: { id: branchId }
      });

      if (!branch) {
        return fail(res, "NOT_FOUND", "Branch not found", 404);
      }

      const cachedForecast = await getBranchDemandForecast(branchId, 24);
      if (cachedForecast) {
        return success(res, {
          branchId,
          forecast: cachedForecast
        }, "Branch demand forecast retrieved (cached)");
      }

      // Import demand forecast service
      const { DemandForecastService } = await import("../../services/ai/demandForecast.service.js");
      const forecast = await DemandForecastService.get24HourForecast(branchId);
      await cacheBranchDemandForecast(branchId, 24, forecast, 30);

      return success(res, {
        branchId,
        forecast
      }, "Branch demand forecast retrieved");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  /**
   * GET /ai/recommendations/:customerId
   * Get recommendations for a customer
   */
  async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = customerIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", parsed.error.issues[0].message, 400);
      }

      const { customerId } = parsed.data;
      const branchId = req.query.branchId as string;

      // Validate branch ID if provided
      if (branchId) {
        const branch = await prisma.branch.findUnique({
          where: { id: branchId }
        });

        if (!branch) {
          return fail(res, "NOT_FOUND", "Branch not found", 404);
        }
      }

      // Validate customer exists
      const customer = await prisma.customer.findUnique({
        where: { id: customerId }
      });

      if (!customer) {
        return fail(res, "NOT_FOUND", "Customer not found", 404);
      }

      // Get recommendations
      const { RecommendationModel } = await import("../../ai/models/recommendationModel.js");
      const recommendations = await RecommendationModel.recommendItems(customerId, branchId, 10);

      return success(res, {
        customerId,
        branchId,
        recommendations
      }, "Recommendations retrieved");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
