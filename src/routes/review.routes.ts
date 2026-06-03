import express from "express";
const { Router } = express;
import { ReviewController } from "../controllers/review.controller.ts";
import { customerAuth } from "../middleware/customerAuth.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

// Customer
router.post("/", customerAuth, ReviewController.submit);
router.put("/:reviewId", customerAuth, ReviewController.update);
router.delete("/:reviewId", customerAuth, ReviewController.delete);
router.post("/item", customerAuth, ReviewController.rateItem);

// Manager
router.get(
  "/branch",
  adminAuth,
  adminRole("manager"),
  ReviewController.branchReviews
);

router.get(
  "/branch/rating",
  adminAuth,
  adminRole("manager"),
  ReviewController.branchRating
);

export default router;








