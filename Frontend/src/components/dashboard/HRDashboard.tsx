import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  Calendar,
  BarChart3,
} from "lucide-react";
import { apiService, User } from "@/services/api";
import { useNavigate } from "react-router-dom";

const HRDashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    newThisMonth: 0,
    pendingOnboarding: 0,
    completedOnboarding: 0,
    averageProgress: 0,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    setError(null);

    apiService
      .getAllUsers(0, 50) // Get first 50 users
      .then((response) => {
        const activeEmployees = response.users.filter((user) => user.isActive);
        setEmployees(activeEmployees);
        calculateStats(activeEmployees);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Error fetching employees:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const calculateStats = (employeeList: User[]) => {
    const totalEmployees = employeeList.length;

    // Calculate employees created this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newThisMonth = employeeList.filter((emp) => {
      const createdDate = new Date(emp.created_at);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    }).length;

    const pendingOnboarding = employeeList.filter(
      (emp) => emp.status === "pending"
    ).length;
    const completedOnboarding = employeeList.filter(
      (emp) => emp.status === "completed"
    ).length;

    // For now, calculate progress based on status (you can enhance this later)
    const getProgressFromStatus = (status: string) => {
      switch (status) {
        case "pending":
          return 25;
        case "in-progress":
          return 60;
        case "completed":
          return 100;
        default:
          return 0;
      }
    };

    const averageProgress =
      totalEmployees > 0
        ? employeeList.reduce(
            (acc, emp) => acc + getProgressFromStatus(emp.status),
            0
          ) / totalEmployees
        : 0;

    setStats({
      totalEmployees,
      newThisMonth,
      pendingOnboarding,
      completedOnboarding,
      averageProgress,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading employees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-red-600">Error: {error}</div>
        <Button onClick={fetchEmployees}>Retry</Button>
      </div>
    );
  }

  const recentEmployees = employees
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          HR Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage employee onboarding and track progress across the organization.
        </p>
      </div>

      {/* Stats Cards - keeping existing structure but with real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New This Month
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Recently joined</p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOnboarding}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedOnboarding}
            </div>
            <p className="text-xs text-muted-foreground">Fully onboarded</p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageProgress.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all employees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-professional lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Employees
            </CardTitle>
            <CardDescription>
              Latest additions to your team and their onboarding progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEmployees.map((employee) => (
              <div
                key={employee._id}
                className="flex items-center gap-4 p-3 border rounded-lg"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{employee.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {employee.department || "No department"} • {employee.role} •
                    Created {new Date(employee.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={
                        employee.status === "pending"
                          ? 25
                          : employee.status === "in-progress"
                          ? 60
                          : employee.status === "completed"
                          ? 100
                          : 0
                      }
                      className="h-2 flex-1"
                    />
                    <span className="text-xs text-muted-foreground">
                      {employee.status === "pending"
                        ? "25"
                        : employee.status === "in-progress"
                        ? "60"
                        : employee.status === "completed"
                        ? "100"
                        : "0"}
                      %
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate("/user-management")}
            >
              View All Employees
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions - keep existing */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common HR tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate("/create-user")}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Employee
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interviews
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Review Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
          <CardDescription>Onboarding progress by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from(
              new Set(employees.map((emp) => emp.department).filter(Boolean))
            ).map((dept) => {
              const deptEmployees = employees.filter(
                (emp) => emp.department === dept
              );
              const avgProgress =
                deptEmployees.length > 0
                  ? deptEmployees.reduce((acc, emp) => {
                      const progress =
                        emp.status === "pending"
                          ? 25
                          : emp.status === "in-progress"
                          ? 60
                          : emp.status === "completed"
                          ? 100
                          : 0;
                      return acc + progress;
                    }, 0) / deptEmployees.length
                  : 0;

              return (
                <div key={dept} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">
                    {dept || "No Department"}
                  </h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {deptEmployees.length} employees
                    </span>
                    <span className="text-sm font-medium">
                      {avgProgress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={avgProgress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRDashboard;
