import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Menu, CheckCircle2 } from "lucide-react";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <FolderKanban className="w-5 h-5" />,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <CheckSquare className="w-5 h-5" />,
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-background flex text-text-primary font-sans selection:bg-primary/20 selection:text-primary">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#ECFDF5] border-r border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col shadow-sm ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-border shrink-0 bg-[#ECFDF5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">Worksync</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#A7F3D0] text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-[#D1FAE5]"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border bg-[#ECFDF5]">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white border border-border shadow-sm">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary uppercase shrink-0">
              {user?.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
              <p className="text-xs text-text-secondary truncate capitalize">{user?.role.toLowerCase()}</p>
            </div>
          </div>
          <button
             onClick={logout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-text-secondary hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-border bg-white flex items-center justify-between px-4 shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">Worksync</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors bg-gray-50 rounded-lg border border-border"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-background min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
