import { Router } from "express";
import * as ServiceController from "./service.controller";

const router = Router();

// Public routes
router.get("/categories", ServiceController.getAllCategories);
router.get("/categories/:id", ServiceController.getCategoryById);

export default router;
