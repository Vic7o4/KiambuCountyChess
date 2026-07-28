import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Users, CreditCard, Image, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/kcca-logo-enhanced.png";
import { toast } from "sonner";

const adminLinks = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/admin/events", label: "Manage Events", icon: CalendarDays },
  { path: "/admin/registrations", label: "Registrations", icon: Users },
  { path: "/admin/payments", label: "Payments", icon: CreditCard },
  { path: "/admin/gallery", label: "Gallery", icon: Image },
];

const AdminLayout = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground shrink-0 hidden md:flex flex-col">
        <div className="p-5 border-b border-primary-foreground/10 flex items-center gap-3">
          <img src={logo} alt="KCCA Logo" className="h-9 w-9 rounded-full" />
          <div>
            <h2 className="font-display text-lg font-bold">KCCA Admin</h2>
            <p className="text-xs text-primary-foreground/50 truncate max-w-[140px]">{user?.email}</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminLinks.map((link) => {
            const isActive = link.exact
              ? location.pathname === link.path
              : location.pathname.startsWith(link.path) && link.path !== "/admin";
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-primary-foreground/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Website
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-sm text-primary-foreground/60 hover:text-secondary transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-primary text-primary-foreground h-14 flex items-center px-4 justify-between">
        <span className="font-display font-bold">KCCA Admin</span>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-primary-foreground/70">← Website</Link>
          <button onClick={handleSignOut} className="text-sm text-primary-foreground/70">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-primary text-primary-foreground flex justify-around py-2 border-t border-primary-foreground/10">
        {adminLinks.map((link) => {
          const isActive = link.exact
            ? location.pathname === link.path
            : location.pathname.startsWith(link.path) && link.path !== "/admin";
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-0.5 text-xs ${isActive ? "text-accent" : "text-primary-foreground/60"}`}
            >
              <link.icon className="h-5 w-5" />
              <span className="truncate max-w-[60px]">{link.label.split(" ").pop()}</span>
            </Link>
          );
        })}
      </div>

      {/* Content */}
      <main className="flex-1 md:p-8 p-4 pt-18 pb-20 md:pt-8 md:pb-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
