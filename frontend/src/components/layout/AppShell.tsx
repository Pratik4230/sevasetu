import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import { Button } from "@/components/ui/button";
import { authService } from "@/features/auth/services/auth.service";

const linkBase =
  "rounded-full px-3 py-1.5 text-sm font-medium text-emerald-900/80 transition-all hover:bg-emerald-100 hover:text-emerald-950";
const linkActive = "bg-emerald-700 text-white shadow-sm hover:bg-emerald-700 hover:text-white";

export function AppShell() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
    } catch {
      // If logout API fails, still clear local session.
    } finally {
      logout();
      setLoggingOut(false);
      navigate("/auth", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_45%),linear-gradient(to_bottom,_#f5fffa,_#ecfdf5_30%,_#f8fafc)]">
      <header className="sticky top-0 z-20 border-b border-emerald-200/70 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-wide text-emerald-900">
            SevaSetu
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/70 p-1 shadow-sm">
            <NavLink
              to="/"
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
            >
              Dashboard
            </NavLink>

            {user?.role === "customer" && (
              <>
                <NavLink
                  to="/customer/bookings"
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
                >
                  My Bookings
                </NavLink>
                <NavLink
                  to="/customer/bookings/new"
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
                >
                  New Booking
                </NavLink>
              </>
            )}

            {user?.role === "provider" && (
              <>
                <NavLink
                  to="/provider/jobs"
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
                >
                  Incoming Jobs
                </NavLink>
                <NavLink
                  to="/provider/profile"
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
                >
                  Provider Profile
                </NavLink>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <NavLink
                  to="/admin/providers/pending"
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
                >
                  Providers
                </NavLink>
                <NavLink
                  to="/admin/categories"
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
                >
                  Categories
                </NavLink>
                <NavLink
                  to="/admin/reviews"
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
                >
                  Reviews
                </NavLink>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
                >
                  Users
                </NavLink>
              </>
            )}

            <NavLink
              to="/profile"
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
            >
              Profile
            </NavLink>
            <Button size="sm" variant="destructive" disabled={loggingOut} onClick={handleLogout}>
              {loggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
