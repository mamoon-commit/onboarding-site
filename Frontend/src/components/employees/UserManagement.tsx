import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiService, User } from "@/services/api";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<User[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleDropdowns, setRoleDropdowns] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedRole, setSelectedRole] = useState<{ [key: string]: string }>(
    {}
  );

  const toggleRoleDropdown = (userId: string) => {
    setRoleDropdowns((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

 
  const BackButton = () => (
    <Button
      variant="default"
      onClick={() => navigate("/dashboard")}
      className="flex items-center gap-2"
    >
      ← Back to Dashboard
    </Button>
  );
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    setErrors(null);

    apiService
      .getAllUsers(0, 50)
      .then((response) => {
        setEmployees(response.users);
      })
      .catch((error) => {
        setErrors("Failed to fetch employees");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("");
  };

  const handleDeactivateUser = (userId: string) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      apiService
        .deactivateUser(userId)
        .then(() => {
          fetchEmployees();
        })
        .catch((error) => {
          setErrors("Failed to deactivate user");
        });
    }
  };
  const handleActivateUser = (userId: string) => {
    if (window.confirm("Are you sure you want to activate this user?")) {
      apiService
        .activateUser(userId)
        .then(() => {
          fetchEmployees();
        })
        .catch((error) => {
          setErrors("Failed to activate user");
        });
    }
  };

  const handleChangeRole = (userId: string) => {
    navigate(`/change-role/${userId}`);
  };
   const handleRoleChange = async (userId: string, newRole: string) => {
     try {
       // Call your existing role update API
       await apiService.updateUserRole(userId, newRole);
       fetchEmployees(); // Refresh the list
       setRoleDropdowns((prev) => ({ ...prev, [userId]: false })); // Close dropdown
     } catch (error) {
       setErrors("Failed to update role");
     }
   };

  <Button variant="outline" onClick={() => navigate("/dashboard")}>
    ← Back to Dashboard
  </Button>;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Management</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/create-user")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                + Add Employee
              </Button>
              <BackButton />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && <div>Loading employees...</div>}
          {errors && <div className="text-red-500">Error: {errors}</div>}
          {employees.map((employee) => (
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
                  <div className="flex gap-2">
                    {/* todo : these coloring dont work */}
                    <div
                      className={
                        employee.status === "completed"
                          ? "bg-green-100 text-green-800 p-2 rounded-2xl"
                          : employee.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800 p-2 rounded-2xl "
                          : "bg-gray-100 text-gray-800 p-2 rounded-2xl"
                      }
                    >
                      {employee.status}
                    </div>
                    {/* Change Role Dropdown */}
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRoleDropdown(employee._id)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        Change Role
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </Button>

                      {roleDropdowns[employee._id] && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-10">
                          <div className="py-1">
                            {["employee", "manager", "hr"].map((role) => (
                              <button
                                key={role}
                                onClick={() =>
                                  handleRoleChange(employee._id, role)
                                }
                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                  employee.role === role
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700"
                                }`}
                                disabled={employee.role === role}
                              >
                                {role.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {employee.isActive ? (
                      // Show this when user is ACTIVE
                      <Button
                        variant="destructive"
                        onClick={() => handleDeactivateUser(employee._id)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      // Show this when user is INACTIVE
                      <Button
                        variant="secondary"
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={() => handleActivateUser(employee._id)}
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {employee.email} - {employee.role}
                </p>
              </div>
            </div>
          ))}
        </CardContent>

        <div className="flex p-6 pt-0 justify-end">
          <BackButton />
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
