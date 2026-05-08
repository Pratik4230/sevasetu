import { AppError } from "../../shared/utils/app-error";
import { env } from "../../shared/config/env";

export type BookingStatus =
  | "requested"
  | "quoted"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ActorRole = "customer" | "provider" | "admin";

interface TransitionOptions {
  currentStatus: BookingStatus;
  action: "quote" | "confirm" | "reject" | "start" | "complete" | "cancel" | "reschedule";
  actor: ActorRole;
  scheduledAt?: Date; // required for reschedule
}

// Valid transitions table
const ALLOWED_TRANSITIONS: Record<
  string,
  { nextStatus: BookingStatus; allowedActors: ActorRole[] }
> = {
  "requested:quote":     { nextStatus: "quoted",       allowedActors: ["provider"] },
  "requested:reject":    { nextStatus: "cancelled",    allowedActors: ["provider"] },
  "requested:cancel":    { nextStatus: "cancelled",    allowedActors: ["customer", "admin"] },
  "quoted:confirm":      { nextStatus: "confirmed",    allowedActors: ["customer"] },
  "quoted:cancel":       { nextStatus: "cancelled",    allowedActors: ["customer", "provider", "admin"] },
  "confirmed:start":     { nextStatus: "in_progress",  allowedActors: ["provider"] },
  "confirmed:cancel":    { nextStatus: "cancelled",    allowedActors: ["customer", "provider", "admin"] },
  "in_progress:complete":{ nextStatus: "completed",    allowedActors: ["provider"] },
};

export const transition = (opts: TransitionOptions): BookingStatus => {
  const { currentStatus, action, actor } = opts;

  // Reschedule is a special case — status doesn't change
  if (action === "reschedule") {
    if (!["requested", "quoted", "confirmed"].includes(currentStatus)) {
      throw new AppError(
        `Cannot reschedule a booking in '${currentStatus}' status`,
        400
      );
    }
    if (actor !== "customer") {
      throw new AppError("Only the customer can reschedule a booking", 403);
    }
    if (!opts.scheduledAt) {
      throw new AppError("New scheduled time is required for rescheduling", 400);
    }
    return currentStatus; // status stays the same
  }

  const key = `${currentStatus}:${action}`;
  const rule = ALLOWED_TRANSITIONS[key];

  if (!rule) {
    throw new AppError(
      `Cannot perform '${action}' on a booking in '${currentStatus}' status`,
      400
    );
  }

  if (!rule.allowedActors.includes(actor)) {
    throw new AppError(
      `Only ${rule.allowedActors.join(" or ")} can perform '${action}'`,
      403
    );
  }

  return rule.nextStatus;
};

/**
 * Checks if a booking can still be cancelled by the customer.
 * Enforces the 2-hour cutoff rule for confirmed bookings.
 */
export const canCustomerCancel = (
  status: BookingStatus,
  scheduledAt: Date
): boolean => {
  if (status === "requested") return true;
  if (status === "quoted") return true;

  if (status === "confirmed") {
    const cutoffMs = env.CANCELLATION_CUTOFF_HOURS * 60 * 60 * 1000;
    const msUntilScheduled = scheduledAt.getTime() - Date.now();
    return msUntilScheduled > cutoffMs;
  }

  return false;
};
