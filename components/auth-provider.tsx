"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: number
  name: string
  email: string
  username: string
}

type LoginData = {
  email: string
  password: string
}

type RegisterData = {
  name: string
  username: string
  email: string
  password: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))

      // Also set the cookie for middleware authentication
      document.cookie = `user=${storedUser}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
    setIsLoading(false)
  }, [])

  const login = async (data: LoginData) => {
    // In a real app, you would call your API here
    // For demo purposes, we'll simulate a successful login
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData = {
        id: 1,
        name: "Admin User",
        email: data.email,
        username: "admin",
      }

      setUser(userData)
      const userString = JSON.stringify(userData)
      localStorage.setItem("user", userString)

      // Set cookie for middleware authentication
      document.cookie = `user=${userString}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const register = async (data: RegisterData) => {
    // In a real app, you would call your API here
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")

    // Clear the authentication cookie
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // Only redirect to login if currently on a dashboard page
    if (pathname?.startsWith("/dashboard")) {
      router.push("/login")
    }
  }

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
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
