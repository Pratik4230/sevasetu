import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";
import { upload } from "../../shared/middleware/upload.middleware";
import * as ProviderController from "./provider.controller";

const router = Router();

// Public — browse available providers
router.get("/", ProviderController.browseProviders);
router.get("/:id", ProviderController.getProviderById);

// Provider-only routes
router.use(authenticate, requireRole("provider"));
router.post(
  "/profile",
  upload.array("documents", 5),
  ProviderController.createProfile
);
router.get("/profile/me", ProviderController.getMyProfile);
router.patch("/profile", ProviderController.updateProfile);
router.patch("/availability", ProviderController.toggleAvailability);

export default router;
