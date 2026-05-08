import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";
import * as ReviewController from "./review.controller";

const router = Router();

// Public — browse provider reviews
router.get("/provider/:providerId", ReviewController.getProviderReviews);

// Customer only — submit review
router.post("/", authenticate, requireRole("customer"), ReviewController.submitReview);

export default router;
