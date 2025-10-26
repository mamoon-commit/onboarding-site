import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import HRDashboard from "@/components/dashboard/HRDashboard";
import ManagerDashboard from "@/components/dashboard/ManagerDashboard";
import { useAuth } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound";
import UserManagement from "./components/employees/UserManagement"
import AllEmployees from "./components/employees/AllEmployees";
import UserForm from "./components/common/UserForm";
import Documents from "./components/documents/Documents";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DashboardRouter />} />
              <Route
                path="tasks"
                element={<div className="p-6">Tasks Page - Coming Soon</div>}
              />
              <Route
                path="documents"
                element={
                  <ProtectedRoute allowedRoles={["hr"]}>
                    <Documents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="calendar"
                element={<div className="p-6">Calendar Page - Coming Soon</div>}
              />
              <Route
                path="messages"
                element={<div className="p-6">Messages Page - Coming Soon</div>}
              />

              {/* HR Only Routes */}
              <Route
                path="employees"
                element={
                  <ProtectedRoute allowedRoles={["hr"]}>
                    <div className="p-6">
                      Employees Management - Coming Soon
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="analytics"
                element={
                  <ProtectedRoute allowedRoles={["hr"]}>
                    <div className="p-6">Analytics Page - Coming Soon</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="user-management"
                element={
                  <ProtectedRoute allowedRoles={["hr"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="all-employees"
                element={
                  <ProtectedRoute allowedRoles={["hr"]}>
                    <AllEmployees />
                  </ProtectedRoute>
                }
              />
              {/* both Manager and HR Routes */}
              <Route
                path="create-user"
                element={
                  <ProtectedRoute allowedRoles={["hr", "manager"]}>
                    <UserForm />
                  </ProtectedRoute>
                }
              />
              {/* Manager Only Routes */}
              <Route
                path="team"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <div className="p-6">Team Overview - Coming Soon</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="approvals"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <div className="p-6">Approvals - Coming Soon</div>
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Component to route to the correct dashboard based on user role
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "hr":
      return <HRDashboard />;
    case "manager":
      return <ManagerDashboard />;
    case "employee":
    default:
      return <EmployeeDashboard />;
  }
};

export default App;
