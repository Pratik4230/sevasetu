import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "../features/auth/pages/AuthPage";
import { Navigate } from "react-router-dom";
import { MyBookingsPage } from "@/features/customer/bookings/pages/MyBookingsPage";
import { CreateBookingPage } from "@/features/customer/bookings/pages/CreateBookingPage";
import { BookingDetailPage } from "@/features/customer/bookings/pages/BookingDetailPage";
import { IncomingJobsPage } from "@/features/provider/bookings/pages/IncomingJobsPage";
import { JobDetailPage } from "@/features/provider/bookings/pages/JobDetailPage";
import { MyProfilePage } from "@/features/provider/profile/pages/MyProfilePage";
import { PendingProvidersPage } from "@/features/admin/providers/pages/PendingProvidersPage";
import { CategoriesPage } from "@/features/admin/categories/pages/CategoriesPage";
import { ReviewModerationPage } from "@/features/admin/reviews/pages/ReviewModerationPage";
import { UsersPage } from "@/features/admin/users/pages/UsersPage";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { AuthGuard } from "./AuthGuard";
import { RoleGuard } from "./RoleGuard";
import { useAuthStore } from "@/shared/stores/auth.store";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/shared/components/PageHeader";

const PublicOnly = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const TempDashboard = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Welcome, ${user?.name ?? "User"}`}
        subtitle="Manage services, jobs, and operations from your premium workspace."
      />
      <Card className="border-emerald-200/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-emerald-900">Account Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-emerald-900/80">
          <p>You are logged in as: <span className="font-medium capitalize">{user?.role}</span>.</p>
          <p>Use the top navigation to move across role-specific modules.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <PublicOnly>
        <AuthPage />
      </PublicOnly>
    ),
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <TempDashboard /> },
      { path: "profile", element: <ProfilePage /> },
      {
        path: "customer/bookings",
        element: (
          <RoleGuard role="customer">
            <MyBookingsPage />
          </RoleGuard>
        ),
      },
      {
        path: "customer/bookings/new",
        element: (
          <RoleGuard role="customer">
            <CreateBookingPage />
          </RoleGuard>
        ),
      },
      {
        path: "customer/bookings/:id",
        element: (
          <RoleGuard role="customer">
            <BookingDetailPage />
          </RoleGuard>
        ),
      },
      {
        path: "provider/jobs",
        element: (
          <RoleGuard role="provider">
            <IncomingJobsPage />
          </RoleGuard>
        ),
      },
      {
        path: "provider/jobs/:id",
        element: (
          <RoleGuard role="provider">
            <JobDetailPage />
          </RoleGuard>
        ),
      },
      {
        path: "provider/profile",
        element: (
          <RoleGuard role="provider">
            <MyProfilePage />
          </RoleGuard>
        ),
      },
      {
        path: "admin/providers/pending",
        element: (
          <RoleGuard role="admin">
            <PendingProvidersPage />
          </RoleGuard>
        ),
      },
      {
        path: "admin/categories",
        element: (
          <RoleGuard role="admin">
            <CategoriesPage />
          </RoleGuard>
        ),
      },
      {
        path: "admin/reviews",
        element: (
          <RoleGuard role="admin">
            <ReviewModerationPage />
          </RoleGuard>
        ),
      },
      {
        path: "admin/users",
        element: (
          <RoleGuard role="admin">
            <UsersPage />
          </RoleGuard>
        ),
      },
    ],
  },
]);
