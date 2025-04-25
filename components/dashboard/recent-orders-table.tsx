"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink } from "lucide-react"

type Order = {
  id: number
  customer: string
  date: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
}

export function RecentOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For demo purposes, we'll use mock data
    setOrders([
      {
        id: 1001,
        customer: "Alex Johnson",
        date: "2023-04-23",
        total: 129.99,
        status: "delivered",
      },
      {
        id: 1002,
        customer: "Sarah Williams",
        date: "2023-04-22",
        total: 89.95,
        status: "shipped",
      },
      {
        id: 1003,
        customer: "Michael Brown",
        date: "2023-04-22",
        total: 45.5,
        status: "processing",
      },
      {
        id: 1004,
        customer: "Emily Davis",
        date: "2023-04-21",
        total: 199.99,
        status: "pending",
      },
      {
        id: 1005,
        customer: "David Miller",
        date: "2023-04-20",
        total: 65.75,
        status: "cancelled",
      },
    ])
  }, [])

  const getStatusColor = (status: Order["status"]) => {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center p-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="/dashboard/orders">
            View all orders
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
