import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { upload } from "../../shared/middleware/upload.middleware";
import * as UserController from "./user.controller";

const router = Router();

router.use(authenticate);

router.get("/me", UserController.getMe);
router.patch("/me", upload.single("avatar"), UserController.updateMe);
router.patch("/me/password", UserController.changePassword);

export default router;
