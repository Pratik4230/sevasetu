import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";
import * as AdminController from "./admin.controller";

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireRole("admin"));

// ─── Providers ────────────────────────────────────────────────────────────────
router.get("/providers/pending", AdminController.getPendingProviders);
router.patch("/providers/:id/approve", AdminController.approveProvider);
router.patch("/providers/:id/reject", AdminController.rejectProvider);

// ─── Users ────────────────────────────────────────────────────────────────────
router.get("/users", AdminController.getAllUsers);
router.patch("/users/:id/deactivate", AdminController.deactivateUser);

// ─── Categories ───────────────────────────────────────────────────────────────
router.post("/categories", AdminController.createCategory);
router.patch("/categories/:id", AdminController.updateCategory);
router.delete("/categories/:id", AdminController.deleteCategory);

// ─── Reviews ──────────────────────────────────────────────────────────────────
router.get("/reviews", AdminController.getAllReviews);
router.patch("/reviews/:id/moderate", AdminController.moderateReview);

export default router;
