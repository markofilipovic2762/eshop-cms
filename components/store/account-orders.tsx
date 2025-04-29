"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Package } from "lucide-react"
import { Order } from "@/app/dashboard/orders/page"

export function AccountOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock orders data
        const mockOrders = [
          {
            id: "ORD-123456",
            date: "2023-06-15",
            total: 129.99,
            status: "delivered",
            items: 2,
          },
          {
            id: "ORD-123457",
            date: "2023-05-28",
            total: 89.95,
            status: "shipped",
            items: 1,
          },
          {
            id: "ORD-123458",
            date: "2023-04-10",
            total: 199.99,
            status: "delivered",
            items: 3,
          },
        ]

        setOrders(mockOrders)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Order History</h2>
          <p className="text-muted-foreground">View and track your orders.</p>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <Skeleton className="h-6 w-32" />
                  <div className="mt-2 flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Order History</h2>
          <p className="text-muted-foreground">View and track your orders.</p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
          <Package className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Button asChild className="mt-4">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Order History</h2>
        <p className="text-muted-foreground">View and track your orders.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="rounded-lg border p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <h3 className="font-medium">{order.id}</h3>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(order.date).toLocaleDateString()}
                </div>
              </div>
              <div>
                <Badge variant="outline" className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {order.items} {order.items === 1 ? "item" : "items"} • ${order.total.toFixed(2)}
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/account/orders/${order.id}`}>View Order</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
