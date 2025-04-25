"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ShoppingCart, Tag, Truck, TrendingUp, DollarSign, Users, BarChart } from "lucide-react"
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table"
import { TopProductsTable } from "@/components/dashboard/top-products-table"
import { OverviewChart } from "@/components/dashboard/overview-chart"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For demo purposes, we'll use mock data
    setStats({
      totalSales: 24680,
      totalOrders: 156,
      totalProducts: 89,
      totalCustomers: 312,
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance and recent activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-emerald-500" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-emerald-500" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-emerald-500" />
              +3.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-emerald-500" />
              +5.7% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your store's recent orders and product updates</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="mt-4">
                <RecentOrdersTable />
              </TabsContent>
              <TabsContent value="products" className="mt-4">
                <TopProductsTable />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/dashboard/products/new"
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-4 hover:border-primary hover:bg-muted"
              >
                <Package className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Add Product</span>
              </Link>
              <Link
                href="/dashboard/categories/new"
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-4 hover:border-primary hover:bg-muted"
              >
                <Tag className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Add Category</span>
              </Link>
              <Link
                href="/dashboard/suppliers/new"
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-4 hover:border-primary hover:bg-muted"
              >
                <Truck className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Add Supplier</span>
              </Link>
              <Link
                href="/dashboard/orders"
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-4 hover:border-primary hover:bg-muted"
              >
                <ShoppingCart className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">View Orders</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution of sales across product categories</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="flex h-60 w-full items-center justify-center">
              <BarChart className="h-16 w-16 text-muted-foreground" />
              <p className="ml-4 text-sm text-muted-foreground">
                Chart visualization would appear here in a real application
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
