import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/auth.store";
import type { Role } from "@/shared/types/user.types";

interface RoleGuardProps {
  role: Role;
  children: ReactNode;
}

export function RoleGuard({ role, children }: RoleGuardProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
