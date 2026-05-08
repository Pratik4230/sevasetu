import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";
import { upload } from "../../shared/middleware/upload.middleware";
import * as BookingController from "./booking.controller";

const router = Router();

router.use(authenticate);

// ─── Customer Routes ─────────────────────────────────────────────────────────
const customerRouter = Router();
customerRouter.use(requireRole("customer"));

customerRouter.post(
  "/",
  upload.single("attachment"),
  BookingController.createBooking
);
customerRouter.get("/", BookingController.getMyBookings);
customerRouter.get("/:id", BookingController.getBookingById);
customerRouter.patch("/:id/reschedule", BookingController.rescheduleBooking);
customerRouter.patch("/:id/cancel", BookingController.cancelBooking);
customerRouter.patch("/:id/confirm", BookingController.confirmQuotedBooking);

// ─── Provider Routes ──────────────────────────────────────────────────────────
const providerRouter = Router();
providerRouter.use(requireRole("provider"));

providerRouter.get("/", BookingController.getProviderBookings);
providerRouter.get("/:id", BookingController.getBookingById);
providerRouter.patch("/:id/quote", BookingController.quoteBooking);
providerRouter.patch("/:id/reject", BookingController.rejectBooking);
providerRouter.patch("/:id/start", BookingController.startJob);
providerRouter.patch(
  "/:id/complete",
  upload.fields([
    { name: "before", maxCount: 5 },
    { name: "after", maxCount: 5 },
  ]),
  BookingController.completeJob
);
providerRouter.patch(
  "/:id/notes",
  upload.fields([
    { name: "before", maxCount: 5 },
    { name: "after", maxCount: 5 },
  ]),
  BookingController.updateWorkNotes
);

router.use("/customer", customerRouter);
router.use("/provider", providerRouter);

export default router;
