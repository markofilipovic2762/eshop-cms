"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { AccountProfile } from "@/components/store/account-profile"
import { AccountOrders } from "@/components/store/account-orders"
import { AccountAddresses } from "@/components/store/account-addresses"
import { LogOut } from "lucide-react"

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login?redirect=/account"
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Button asChild className="mt-2 w-full">
              <Link href="/login?redirect=/account">Sign In</Link>
            </Button>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="underline">
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Account</h1>
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <AccountProfile user={user} />
        </TabsContent>

        <TabsContent value="orders">
          <AccountOrders />
        </TabsContent>

        <TabsContent value="addresses">
          <AccountAddresses />
        </TabsContent>
      </Tabs>
    </div>
  )
}
