import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

function Sidebar({ mobileMenuOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
      section: "main",
    },
    {
      icon: ClipboardList,
      label: "Complaints",
      path: "/admin/complaints",
      section: "operations",
    },
    {
      icon: CheckSquare,
      label: "Tasks",
      path: "/admin/tasks",
      section: "operations",
    },
    {
      icon: Users,
      label: "Staff",
      path: "/admin/staff",
      section: "management",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/admin/analytics",
      section: "reports",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/admin/settings",
      section: "settings",
    },
  ];

  const sections = [
    {
      key: "main",
      label: "MAIN",
    },
    {
      key: "operations",
      label: "OPERATIONS",
    },
    {
      key: "management",
      label: "MANAGEMENT",
    },
    {
      key: "reports",
      label: "REPORTS",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col
          border-r border-slate-800 bg-slate-950 text-white
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div
          className={`
            flex h-16 shrink-0 items-center border-b border-slate-800
            ${collapsed ? "justify-center px-3" : "justify-between px-4"}
          `}
        >
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-3"
          >
            {/* Logo */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-950/30">
              <span className="text-sm font-bold tracking-tight">CC</span>
            </div>

            {!collapsed && (
              <div className="text-left">
                <p className="text-sm font-bold tracking-wide text-white">
                  CleanCity
                </p>
                <p className="text-[11px] text-slate-400">
                  Administration
                </p>
              </div>
            )}
          </button>

          {/* Desktop collapse button */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`
              hidden h-8 w-8 items-center justify-center rounded-lg
              text-slate-400 transition
              hover:bg-slate-800 hover:text-white
              lg:flex
              ${collapsed ? "absolute -right-4 top-5 bg-slate-900 shadow-md" : ""}
            `}
          >
            {collapsed ? (
              <ChevronRight size={17} />
            ) : (
              <ChevronLeft size={17} />
            )}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            title="Close navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-6">
            {sections.map((section) => {
              const sectionItems = menuItems.filter(
                (item) => item.section === section.key
              );

              return (
                <div key={section.key}>
                  {!collapsed && (
                    <div className="mb-2 px-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {section.label}
                      </span>
                    </div>
                  )}

                  <ul className="space-y-1">
                    {sectionItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);

                      return (
                        <li key={item.path}>
                          <button
                            type="button"
                            onClick={() => handleNavigation(item.path)}
                            title={collapsed ? item.label : undefined}
                            className={`
                              group relative flex w-full items-center
                              rounded-xl transition-all duration-200
                              ${
                                collapsed
                                  ? "justify-center px-2 py-3"
                                  : "gap-3 px-3 py-2.5"
                              }
                              ${
                                active
                                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/20"
                                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                              }
                            `}
                          >
                            {/* Active indicator */}
                            {active && !collapsed && (
                              <span className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400" />
                            )}

                            <Icon
                              size={19}
                              strokeWidth={active ? 2.3 : 2}
                              className={`
                                shrink-0 transition-transform duration-200
                                group-hover:scale-105
                                ${
                                  active
                                    ? "text-white"
                                    : "text-slate-400 group-hover:text-white"
                                }
                              `}
                            />

                            {!collapsed && (
                              <span className="flex-1 text-left text-sm font-medium">
                                {item.label}
                              </span>
                            )}

                            {/* Active dot for collapsed mode */}
                            {active && collapsed && (
                              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-800 p-3">
          {!collapsed && (
            <div className="mb-3 rounded-xl bg-slate-900 px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Users size={17} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-200">
                    Administration
                  </p>
                  <p className="truncate text-[11px] text-slate-500">
                    System management
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className={`
              group flex w-full items-center rounded-xl
              text-red-400 transition-all duration-200
              hover:bg-red-500/10 hover:text-red-300
              ${
                collapsed
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-3 py-2.5"
              }
            `}
          >
            <LogOut
              size={19}
              className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
            />

            {!collapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;