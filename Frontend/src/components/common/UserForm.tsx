import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiService } from "@/services/api";

interface UserFormProps {
  onSuccess?: () => void; // Callback when user is created successfully
  onCancel?: () => void; // Callback when user cancels
}

const UserForm = ({ onSuccess, onCancel }: UserFormProps) => {
  const navigate = useNavigate();
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    position: "",
    department: "",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiService.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        position: formData.position || undefined,
        department: formData.department || undefined,
      });

      // Success! Clear form and call success callback
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        position: "",
        department: "",
      });

      if (onSuccess) {
          onSuccess();
      }else {
          navigate("/all-employees");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/dashboard");
    }
  };
  return (
    <Card className="w-full max-w-6xl mx-auto grid-cols-1 md:grid-cols-2">
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter full name"
              disabled={loading}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter password"
              disabled={loading}
            />
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Position Field */}
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              placeholder="Enter position (optional)"
              disabled={loading}
            />
          </div>

          {/* Department Field */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              type="text"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              placeholder="Enter department (optional)"
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create User"}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
