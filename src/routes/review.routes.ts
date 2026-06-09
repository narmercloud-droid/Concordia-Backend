import express from "express";
const { Router } = express;
import { ReviewController } from "../controllers/review.controller.ts";
import { customerAuth } from "../middleware/customerAuth.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.get("/order/:orderId", ReviewController.orderState);

router.post("/", customerAuth, ReviewController.submit);
router.post("/guest", ReviewController.submitGuest);
router.put("/:reviewId", customerAuth, ReviewController.update);
router.delete("/:reviewId", customerAuth, ReviewController.delete);
router.post("/item", customerAuth, ReviewController.rateItem);

router.get("/branch", adminAuth, adminRole("manager"), ReviewController.branchReviews);
router.get("/branch/rating", adminAuth, adminRole("manager"), ReviewController.branchRating);

export default router;
