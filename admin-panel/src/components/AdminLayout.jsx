import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users,
  MessageSquare, GraduationCap, LogOut, Menu, X, PlayCircle, ChevronRight
} from "lucide-react";

const NAV = [
  { to: "/dashboard",   icon: LayoutDashboard, label: "Dashboard"   },
  { to: "/enrollments", icon: GraduationCap,   label: "Enrollments" },
  { to: "/messages",    icon: MessageSquare,   label: "Messages"    },
  { to: "/students",    icon: Users,           label: "Students"    },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`flex flex-col h-full ${mobile ? "w-full" : "w-64"}`}
      style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <PlayCircle className="w-7 h-7" style={{ color: "var(--accent2)" }} />
        <div>
          <div className="font-heading font-bold text-sm leading-tight" style={{ color: "var(--text)" }}>
            Houdini Hollywood
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setSideOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "text-white"
                  : "hover:text-white"
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? "rgba(139,92,246,0.15)" : "transparent",
              color: isActive ? "var(--text)" : "var(--muted)",
              borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
            })}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))" }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
              {user?.first_name} {user?.last_name}
            </div>
            <div className="text-xs truncate" style={{ color: "var(--muted)" }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-red-500/10"
          style={{ color: "var(--danger)" }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sideOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSideOpen(false)} />
          <div className="relative w-72 h-full">
            <Sidebar mobile />
            <button onClick={() => setSideOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md"
              style={{ color: "var(--muted)" }}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-4 md:px-6 py-4 shrink-0"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
          <button onClick={() => setSideOpen(true)} className="md:hidden p-1 rounded-md"
            style={{ color: "var(--muted)" }}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}>
            <span>Admin</span>
            <ChevronRight className="w-3 h-3" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="text-xs px-2 py-1 rounded-full font-bold"
              style={{ background: "rgba(139,92,246,0.15)", color: "var(--accent)" }}>
              ADMIN
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
