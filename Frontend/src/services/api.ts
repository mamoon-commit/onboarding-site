const API_BASE = "http://127.0.0.1:8000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "content-type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    email: string;
    name: string;
    role: "employee" | "hr" | "manager";
  };
}

export interface User {
  _id: string;
  ID: string;
  email: string;
  name: string;
  isActive: boolean;
  position?: string;
  employment_type?: string;
  department?: string;
  address?: string;
  emergency_contact?: string;
  phone?: string;
  status?: string;
  manager_id?: string;
  start_date?: string;
  created_at: string;
  updated_at: string;
  role: "employee" | "hr" | "manager";
}

export interface Document {
  _id: string;
  employee_id: string;
  category: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}
export interface DocumentCategory {
  category: string;
  display_name: string;
}

class ApiService {
  login(credentials: LoginRequest): Promise<LoginResponse> {
    return fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(`Login failed: ${error.error || "Login failed"}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        // ADD THIS LINE - save the token after successful login
        localStorage.setItem("access_token", data.access_token);
        return data;
      });
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  }
  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
  async getAllUsers(
    skip = 0,
    limit = 10
  ): Promise<{ users: User[]; total: number }> {
    const response = await fetch(
      `${API_BASE}/users/list?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to fetch users: ${error.detail || "Failed to fetch users"}`
      );
    }

    return response.json();
  }

  async deactivateUser(userId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to deactivate user: ${
          error.detail || "Failed to deactivate user"
        }`
      );
    }

    return response.json();
  }

  async activateUser(userId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/users/${userId}/activate`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to activate user: ${error.detail || "Failed to activate user"}`
      );
    }

    return response.json();
  }
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    position?: string;
    department?: string;
  }): Promise<{ message: string; user_id: string }> {
    const response = await fetch(`${API_BASE}/users/create`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      return response.json().then((error) => {
        throw new Error(
          `Failed to create user: ${error.detail || "Failed to create user"}`
        );
      });
    }
    return response.json();
  }
  async updateUser(
    userId: string,
    updateData: Partial<User>
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to update user: ${error.detail || "Failed to update user"}`
      );
    }

    return response.json();
  }
  async updateUserRole(
    userId: string,
    role: string
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/users/${userId}/role`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role: role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to update user role: ${
          error.detail || "Failed to update user role"
        }`
      );
    }

    return response.json();
  }
  async getAllUsersForDocument(): Promise<{ users: User[] }> {
    const response = await fetch(`${API_BASE}/documents/users`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to fetch users for document: ${
          error.detail || "Failed to fetch users for document"
        }`
      );
    }

    return response.json();
  }

  async getUserDocumentCategories(userId: string): Promise<{
    user_id: string;
    user_name: string;
    categories: DocumentCategory[];
  }> {
    const response = await fetch(
      `${API_BASE}/documents/user/${userId}/categories`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to fetch user document categories: ${
          error.detail || "Failed to fetch user document categories"
        }`
      );
    }

    return response.json();
  }

  async getDocumentsbyCategories(
    userId: string,
    category: string
  ): Promise<{
    user_id: string;
    user_name: string;
    category: string;
    documents: Document[];
  }> {
    const response = await fetch(
      `${API_BASE}/documents/user/${userId}/category/${category}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to fetch user document categories: ${
          error.detail || "Failed to fetch user document categories"
        }`
      );
    }

    return response.json();
  }
  async uploadDocument(
    file: File,
    employeeId: string,
    category: string
  ): Promise<{ message: string; document: Document }> {
    // Create FormData to send file + metadata
    const formData = new FormData();
    formData.append("file", file);
    formData.append("employee_id", employeeId);
    formData.append("category", category);

    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE}/documents/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // DON'T set Content-Type - browser sets it automatically for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to upload document: ${
          error.detail || "Failed to upload document"
        }`
      );
    }

    return response.json();
  }

  async downloadDocument(documentId: string): Promise<Blob> {
    const response = await fetch(
      `${API_BASE}/documents/download/${documentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to download: ${error.detail || "Failed to download"}`
      );
    }

    return response.blob();
  }
}
export const apiService = new ApiService();
