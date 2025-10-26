import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType } from "@/types/auth";
import { apiService, LoginResponse } from "@/services/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user");
    const authToken = localStorage.getItem("auth_token");

    if (storedUser && authToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await apiService.login({
        email,
        password,
      });

      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.user.email,
          email: response.user.email,
          firstName: response.user.name.split(" ")[0] || response.user.name,
          lastName: response.user.name.split(" ")[1] || "",
          role: response.user.role,
          department: "Software Development",
        })
      );
      setUser({
        id: response.user.email,
        email: response.user.email,
        firstName: response.user.name.split(" ")[0] || response.user.name,
        lastName: response.user.name.split(" ")[1] || "",
        role: response.user.role as "employee" | "hr" | "manager",
        department: "Software Development",
      });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    apiService.logout();
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
