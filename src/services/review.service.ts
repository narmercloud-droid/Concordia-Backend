import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.ts";

const REVIEWABLE_STATUSES = new Set(["delivered", "completed", "picked_up"]);
const MAX_COMMENT_LENGTH = 2000;

type SubmitReviewInput = {
  orderId: string;
  foodRating: number;
  deliveryRating?: number | null;
  comment?: string | null;
};

function clampRating(value: unknown) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}

function normalizeComment(comment?: string | null) {
  const text = String(comment ?? "").trim();
  if (!text) return null;
  return text.slice(0, MAX_COMMENT_LENGTH);
}

function overallRating(foodRating: number, deliveryRating?: number | null) {
  if (deliveryRating == null) return foodRating;
  return Math.round((foodRating + deliveryRating) / 2);
}

export function canReviewOrder(order: {
  status: string;
  fulfillmentType?: string | null;
}) {
  return REVIEWABLE_STATUSES.has(order.status);
}

function serializeReview(review: {
  id: string;
  orderId: string;
  branchId: string;
  customerId: string | null;
  foodRating: number;
  deliveryRating: number | null;
  rating: number | null;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: review.id,
    orderId: review.orderId,
    branchId: review.branchId,
    foodRating: review.foodRating,
    deliveryRating: review.deliveryRating,
    rating: review.rating ?? overallRating(review.foodRating, review.deliveryRating),
    comment: review.comment,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt
  };
}

async function getOrderForReview(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { review: true }
  });
}

function validateReviewInput(
  order: NonNullable<Awaited<ReturnType<typeof getOrderForReview>>>,
  input: SubmitReviewInput
) {
  if (!order) {
    throw { code: "NOT_FOUND", message: "Order not found" };
  }
  if (order.review) {
    throw { code: "CONFLICT", message: "This order already has a review" };
  }
  if (!canReviewOrder(order)) {
    throw { code: "FORBIDDEN", message: "You can review this order after it is completed" };
  }

  const foodRating = clampRating(input.foodRating);
  if (!foodRating) {
    throw { code: "INVALID_INPUT", message: "Food rating must be between 1 and 5" };
  }

  const isDelivery = order.fulfillmentType === "delivery";
  let deliveryRating: number | null = null;
  if (isDelivery) {
    deliveryRating = clampRating(input.deliveryRating);
    if (!deliveryRating) {
      throw { code: "INVALID_INPUT", message: "Delivery rating must be between 1 and 5" };
    }
  } else if (input.deliveryRating != null && input.deliveryRating !== "") {
    deliveryRating = clampRating(input.deliveryRating);
  }

  return {
    foodRating,
    deliveryRating,
    comment: normalizeComment(input.comment)
  };
}

export const reviewService = {
  async getOrderReviewState(orderId: string) {
    const order = await getOrderForReview(orderId);
    if (!order) {
      throw { code: "NOT_FOUND", message: "Order not found" };
    }

    return {
      orderId: order.id,
      branchId: order.branchId,
      fulfillmentType: order.fulfillmentType ?? "delivery",
      status: order.status,
      canReview: canReviewOrder(order) && !order.review,
      hasReview: !!order.review,
      review: order.review ? serializeReview(order.review) : null
    };
  },

  async submitReview(customerId: string, input: SubmitReviewInput) {
    const order = await getOrderForReview(input.orderId);
    if (!order) {
      throw { code: "NOT_FOUND", message: "Order not found" };
    }
    if (order.customerId && order.customerId !== customerId) {
      throw { code: "FORBIDDEN", message: "This order does not belong to your account" };
    }

    const validated = validateReviewInput(order, input);

    const review = await prisma.review.create({
      data: {
        id: randomUUID(),
        orderId: order.id,
        customerId,
        branchId: order.branchId,
        foodRating: validated.foodRating,
        deliveryRating: validated.deliveryRating,
        rating: overallRating(validated.foodRating, validated.deliveryRating),
        comment: validated.comment
      }
    });

    return serializeReview(review);
  },

  async submitGuestReview(input: SubmitReviewInput) {
    const order = await getOrderForReview(input.orderId);
    if (!order) {
      throw { code: "NOT_FOUND", message: "Order not found" };
    }
    if (order.customerId) {
      throw {
        code: "FORBIDDEN",
        message: "Please sign in to review this order"
      };
    }

    const validated = validateReviewInput(order, input);

    const review = await prisma.review.create({
      data: {
        id: randomUUID(),
        orderId: order.id,
        customerId: null,
        branchId: order.branchId,
        foodRating: validated.foodRating,
        deliveryRating: validated.deliveryRating,
        rating: overallRating(validated.foodRating, validated.deliveryRating),
        comment: validated.comment
      }
    });

    return serializeReview(review);
  },

  async updateReview(
    customerId: string,
    reviewId: string,
    input: Partial<SubmitReviewInput>
  ) {
    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing) {
      throw { code: "NOT_FOUND", message: "Review not found" };
    }
    if (existing.customerId !== customerId) {
      throw { code: "FORBIDDEN", message: "You cannot edit this review" };
    }

    const order = await prisma.order.findUnique({ where: { id: existing.orderId } });
    if (!order) {
      throw { code: "NOT_FOUND", message: "Order not found" };
    }

    const foodRating = input.foodRating != null ? clampRating(input.foodRating) : existing.foodRating;
    if (!foodRating) {
      throw { code: "INVALID_INPUT", message: "Food rating must be between 1 and 5" };
    }

    const isDelivery = order.fulfillmentType === "delivery";
    let deliveryRating = existing.deliveryRating;
    if (input.deliveryRating !== undefined) {
      deliveryRating = isDelivery ? clampRating(input.deliveryRating) : clampRating(input.deliveryRating);
    }
    if (isDelivery && !deliveryRating) {
      throw { code: "INVALID_INPUT", message: "Delivery rating must be between 1 and 5" };
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        foodRating,
        deliveryRating,
        rating: overallRating(foodRating, deliveryRating),
        comment: input.comment !== undefined ? normalizeComment(input.comment) : existing.comment
      }
    });

    return serializeReview(updated);
  },

  async deleteReview(customerId: string, reviewId: string) {
    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing) {
      throw { code: "NOT_FOUND", message: "Review not found" };
    }
    if (existing.customerId !== customerId) {
      throw { code: "FORBIDDEN", message: "You cannot delete this review" };
    }
    await prisma.review.delete({ where: { id: reviewId } });
  },

  async rateItem(orderItemId: string, rating: number) {
    const value = clampRating(rating);
    if (!value) {
      throw { code: "INVALID_INPUT", message: "Rating must be between 1 and 5" };
    }

    return prisma.itemRating.upsert({
      where: { orderItemId },
      create: { id: randomUUID(), orderItemId, rating: value },
      update: { rating: value }
    });
  },

  async listBranchReviews(branchId: string) {
    const reviews = await prisma.review.findMany({
      where: { branchId },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        order: {
          select: {
            id: true,
            customerName: true,
            fulfillmentType: true,
            createdAt: true,
            status: true
          }
        },
        customer: {
          select: { name: true, email: true }
        }
      }
    });

    return reviews.map((review) => ({
      ...serializeReview(review),
      customerName: review.customer?.name ?? review.order.customerName ?? "Guest",
      customerEmail: review.customer?.email ?? null,
      order: review.order
    }));
  },

  async branchRating(branchId: string) {
    const [aggregate, deliveryAggregate, count] = await Promise.all([
      prisma.review.aggregate({
        where: { branchId },
        _avg: { foodRating: true, rating: true },
        _count: { _all: true }
      }),
      prisma.review.aggregate({
        where: { branchId, deliveryRating: { not: null } },
        _avg: { deliveryRating: true },
        _count: { _all: true }
      }),
      prisma.review.count({ where: { branchId } })
    ]);

    return {
      reviewCount: count,
      averageFoodRating: aggregate._avg.foodRating,
      averageDeliveryRating: deliveryAggregate._avg.deliveryRating,
      averageOverallRating: aggregate._avg.rating,
      deliveryReviewCount: deliveryAggregate._count._all
    };
  }
};
