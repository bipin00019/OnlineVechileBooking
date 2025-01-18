import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (storedUser && token && refreshToken) {
        setUser(JSON.parse(storedUser));
      } else {
        // Clear any partial auth state
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        const userData = {
          id: response.data.user.id,
          email: response.data.user.email,
          roles: response.data.user.roles,
        };

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        // Verify roles are present
        if (!userData.roles || userData.roles.length === 0) {
          toast.error("No roles assigned to user");
          return { success: false, message: "No roles assigned" };
        }

        toast.success(response.message || "Login successful!");
        return { success: true };
      } else {
        toast.error(response.message || "Login failed");
        return {
          success: false,
          message: response.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.message || "An error occurred during login";
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };
  const value = {
    user,
    loading,
    login,
    isAuthenticated: !!user,
    hasRole: (role) => user?.roles?.includes(role) || false,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider ho?");
    }
    return context;
};
  
export default AuthContext;