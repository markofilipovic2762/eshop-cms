"use client";

import axios from "axios";
import { ca } from "date-fns/locale";
import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";

type User = {
  token: string;
  id: number;
  name: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    console.log("Stored user:", storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    //setIsLoading(true);
    try {
      const result: any = await axios.post("http://localhost:5056/auth/login", {
        email,
        password,
      });

      console.log("Login result:", result.data);

      const data = result.data;

      //const isAdmin = email.includes("admin");
      const user = {
        token: data?.token,
        id: data?.id,
        name: data?.name,
        username: data?.username,
        email: data?.email,
      };

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      //setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
      localStorage.removeItem("user");
      //setIsLoading(false);
      throw new Error("Login failed");
    } finally {
      //setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5056/auth/register", {
        name,
        email,
        password,
      });
      // Registration successful, but we don't log the user in automatically
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
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
