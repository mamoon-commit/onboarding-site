import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AllEmployees from "@/components/employees/AllEmployees";
import {
  LayoutDashboard,
  CheckCircle,
  FileText,
  Users,
  Settings,
  BarChart3,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getNavigationItems = () => {
    const commonItems = [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "My Tasks", href: "/tasks", icon: CheckCircle },
      { title: "Documents", href: "/documents", icon: FileText },
      { title: "Calendar", href: "/calendar", icon: Calendar },
      { title: "Messages", href: "/messages", icon: MessageSquare },
    ];

    if (user?.role === "hr") {
      return [
        ...commonItems,
        { title: "All Users", href: "/all-employees", icon: Users },
        { title: "Analytics", href: "/analytics", icon: BarChart3 },
        { title: "User Management", href: "/user-management", icon: UserCheck },
      ];
    }

    if (user?.role === "manager") {
      return [
        ...commonItems,
        { title: "Team Overview", href: "/team", icon: Users },
        { title: "Approvals", href: "/approvals", icon: UserCheck },
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${isCollapsed ? "w-16" : "w-64"}
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        bg-sidebar border-r border-sidebar-border
        transition-all duration-300 ease-in-out
        flex flex-col
      `}
      >
        {/* Collapse Toggle */}
        <div className="hidden lg:flex justify-end p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                  ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.department}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className={`
              w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <Settings className="h-5 w-5" />
            {!isCollapsed && <span>Settings</span>}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
