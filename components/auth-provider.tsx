"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

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
  login: (data: LoginData) => void
  register: (data: RegisterData) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (data: LoginData) => {
    
    console.log("Pozivam funkciju login")
    api.post("/auth/login", data)
      .then((response) => {
        console.log("Login response:", response)
        const userData = response.data
        console.log("User data:", userData)
        if(!userData) {
          throw new Error("User data is null")
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        router.push("/dashboard")
      })
      .catch((error) => {
        console.error("Login error:", error)
        throw new Error("Login failed")
      }
      )
  }

  const register = (data: RegisterData) => {
    api.post("/auth/register", data).then((response) => {
      // const userData = response.data
      // setUser(userData)
      // localStorage.setItem("user", JSON.stringify(userData))
      window.location.reload()
    }).catch((error) => {
      console.error("Registration error:", error)
      throw new Error("Registration failed")
    });
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
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
