import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiService, User } from "@/services/api";
import { useNavigate } from "react-router-dom";

const AllEmployees = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string | null>(null);
  const [employees, setEmployees] = useState<User[]>([]);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [editableCards, setEditableCards] = useState<string[]>([]);
  const [editedData, setEditedData] = useState<{ [key: string]: string }>({});
  const BackButton = () => (
    <Button
      variant="default"
      onClick={() => navigate("/dashboard")}
      className="flex items-center gap-2"
    >
      ← Back to Dashboard
    </Button>
  );
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  const toggleCard = (id: string) => {
    setExpandedCards((prev) =>
      prev.includes(id) ? prev.filter((cardID) => cardID !== id) : [...prev, id]
    );
  };

  const editCard = (id: string) => {
    setEditableCards((prev) =>
      prev.includes(id) ? prev.filter((cardID) => cardID !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    setErrors(null);

    apiService
      .getAllUsers(0, 50)
      .then((response) => {
        setEmployees(response.users.filter((user) => user.role === "employee"));
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

  const handleSave = async (employeeId: string) => {
    try {
      // Get edited values for this employee
      const updatedFields = {};
      Object.keys(editedData).forEach((key) => {
        if (key.startsWith(`${employeeId}_`)) {
          const fieldName = key.replace(`${employeeId}_`, "");
          updatedFields[fieldName] = editedData[key];
        }
      });
      console.log("Updated fields:", updatedFields);
      // Call API to update user
      await apiService.updateUser(employeeId, updatedFields);

      fetchEmployees();
      // Exit edit mode
      editCard(employeeId);

      // Clear edited data for this employee
      setEditedData((prev) => {
        const newData = { ...prev };
        Object.keys(newData).forEach((key) => {
          if (key.startsWith(`${employeeId}_`)) {
            delete newData[key];
          }
        });
        return newData;
      });
    } catch (error) {
      setErrors("Failed to save changes");
    }
  };

  <Button variant="outline" onClick={() => navigate("/dashboard")}>
    ← Back to Dashboard
  </Button>;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
          {" "}
          {loading && <div>Loading employees...</div>}
          {errors && <div className="text-red-500">Error: {errors}</div>}
          {employees.map((employee, index) => {
            // Calculate approximate row and column (assumes 3 cols on desktop)
            const row = Math.floor(index / 4);
            const col = index % 4;
            const isEvenSquare = (row + col) % 2 === 0;

            const isExpanded = expandedCards.includes(employee._id);
            const isEditable = editableCards.includes(employee._id);

            const handleFieldChange =
              (employeeId: string, fieldName: string) =>
              (e: React.FormEvent<HTMLElement>) => {
                let text = e.currentTarget?.innerText || "";

                // Remove common labels
                text = text.replace(
                  /^(ID:|Email:|Phone:|Department:|Address:|Manager ID:|Employment Type:|Start Date:|Emergency Contact:)\s*/,
                  ""
                );

                setEditedData((prev) => ({
                  ...prev,
                  [`${employeeId}_${fieldName}`]: text,
                }));
              };
            return (
              <div
                onClick={() => toggleCard(employee._id)}
                key={employee._id}
                className={`border rounded-lg p-4 cursor-pointer self-start transition-all duration-300 ease-in-out overflow-hidden ${
                  isEvenSquare ? "bg-white" : "bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(employee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isExpanded ? (
                      <div>
                        {isEditable ? (
                          <div>
                            <h4
                              className="font-medium"
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onInput={handleFieldChange(employee._id, "name")}
                              onClick={stopPropagation}
                            >
                              {employee.name}
                            </h4>{" "}
                            <p
                              className="text-sm text-gray-700"
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onInput={handleFieldChange(
                                employee._id,
                                "position"
                              )}
                              onClick={stopPropagation}
                            >
                              {employee.position}
                            </p>
                            <p
                              className="text-sm text-gray-600"
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onInput={handleFieldChange(employee._id, "email")}
                              onClick={stopPropagation}
                            >
                              <span className="font-medium text-gray-900">
                                Email:{" "}
                              </span>
                              {employee.email}
                            </p>
                            <p
                              className="text-sm text-gray-600"
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onInput={handleFieldChange(
                                employee._id,
                                "department"
                              )}
                              onClick={stopPropagation}
                            >
                              <span className="font-medium text-gray-900">
                                Department:{" "}
                              </span>
                              {employee.department}
                            </p>
                            <p
                              className="text-sm text-gray-600"
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onInput={handleFieldChange(employee._id, "phone")}
                              onClick={stopPropagation}
                            >
                              <span className="font-medium text-gray-900">
                                Phone:{" "}
                              </span>
                              {employee.phone}
                            </p>
                            <p
                              className="text-sm text-gray-600"
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onInput={handleFieldChange(
                                employee._id,
                                "manager_id"
                              )}
                              onClick={stopPropagation}
                            >
                              <span className="font-medium text-gray-900">
                                Manager ID:{" "}
                              </span>
                              {employee.manager_id}
                            </p>
                            <p
                              className="text-sm text-gray-600"
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onInput={handleFieldChange(
                                employee._id,
                                "address"
                              )}
                              onClick={stopPropagation}
                            >
                              <span className="font-medium text-gray-900">
                                Address:{" "}
                              </span>
                              {employee.address}
                            </p>
                            <p
                              className="text-sm text-g ray-600"
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onInput={handleFieldChange(
                                employee._id,
                                "employment_type"
                              )}
                              onClick={stopPropagation}
                            >
                              <span className="font-medium text-gray-900">
                                Employment Type:{" "}
                              </span>
                              {employee.employment_type}
                            </p>
                            <p
                              className="text-sm text-gray-600"
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onInput={handleFieldChange(
                                employee._id,
                                "start_date"
                              )}
                              onClick={stopPropagation}
                            >
                              <span className="font-medium text-gray-900">
                                Start Date:{" "}
                              </span>
                              {employee.start_date}
                            </p>
                            <p
                              className="text-sm text-gray-600"
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onInput={handleFieldChange(
                                employee._id,
                                "emergency_contact"
                              )}
                              onClick={stopPropagation}
                            >
                              <span className="font-medium text-gray-900">
                                Emergency Contact:{" "}
                              </span>{" "}
                              {employee.emergency_contact}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSave(employee._id);
                              }}
                              className="mr-2 bg-blue-500 text-white px-3 py-1 rounded"
                            >
                              save
                            </button>
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                editCard(employee._id);
                              }}
                            >
                              cancel
                            </button>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-medium">{employee.name}</h4>
                            <p className="text-sm text-gray-700">
                              {employee.position}
                            </p>

                            <p className="text-sm text-gray-600">
                              {" "}
                              <span className="font-medium text-gray-900">
                                ID:{" "}
                              </span>{" "}
                              {employee._id}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-900">
                                Email:{" "}
                              </span>
                              {employee.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-900">
                                Department:{" "}
                              </span>
                              {employee.department}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-900">
                                Phone:{" "}
                              </span>
                              {employee.phone}
                            </p>

                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-900">
                                Manager ID:{" "}
                              </span>
                              {employee.manager_id}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-900">
                                Address:{" "}
                              </span>
                              {employee.address}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-900">
                                Employment Type:{" "}
                              </span>
                              {employee.employment_type}
                            </p>

                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-900">
                                Start Date:{" "}
                              </span>
                              {employee.start_date}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-900">
                                Emergency Contact:{" "}
                              </span>
                              {employee.emergency_contact}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-900">
                                Updated At:{" "}
                              </span>
                              {employee.updated_at}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-900">
                                Created At:{" "}
                              </span>
                              {employee.created_at}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                editCard(employee._id);
                              }}
                              className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium">{employee.name}</h4>
                        <p className="text-sm text-gray-700">
                          {employee.position}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
        <div className="flex p-6 pt-0 justify-end">
          <BackButton />
        </div>
      </Card>
    </div>
  );
};

export default AllEmployees;
