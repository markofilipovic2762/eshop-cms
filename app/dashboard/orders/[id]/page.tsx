"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Calendar, MapPin, Package, ShoppingCart, User } from "lucide-react"
import { getOrder, updateOrderStatus, getProducts } from "@/lib/api"

type Order = {
  id: number
  userId: number
  totalPrice: number
  orderDate: string
  shipAddress: string
  shipCity: string
  shipPostalCode: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: Array<{
    productId: number
    quantity: number
    price: number
    productName?: string
    productImage?: string
  }>
  customerName?: string // Added for display purposes
}

type Product = {
  id: number
  name: string
  imageUrl: string
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        const [orderData, productsData] = await Promise.all([getOrder(Number.parseInt(params.id)), getProducts()])

        // Add customer name for display
        const customerName = getRandomCustomerName()

        // Enhance order items with product details
        const enhancedItems = orderData.items.map((item: any) => {
          const product = productsData.find((p: Product) => p.id === item.productId)
          return {
            ...item,
            productName: product ? product.name : `Product #${item.productId}`,
            productImage: product ? product.imageUrl : "/placeholder.svg?height=50&width=50",
          }
        })

        setOrder({
          ...orderData,
          customerName,
          items: enhancedItems,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch order details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const getRandomCustomerName = () => {
    const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah", "Robert", "Lisa"]
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia"]

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)]

    return `${randomFirstName} ${randomLastName}`
  }

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

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return

    setIsUpdating(true)
    try {
      // In a real app, this would be an API call
      await updateOrderStatus(order.id, newStatus as Order["status"])

      setOrder({
        ...order,
        status: newStatus as Order["status"],
      })

      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Order Not Found</h2>
        <p className="text-muted-foreground">The order you're looking for doesn't exist.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Order #{order.id}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={order.status} onValueChange={handleStatusChange} disabled={isUpdating}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>Details about this order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Date:</span>
              </div>
              <span>{new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status:</span>
              </div>
              <Badge variant="outline" className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Items:</span>
              </div>
              <span>{order.items.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Total:</span>
              </div>
              <span className="font-bold">${order.totalPrice.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer & Shipping</CardTitle>
            <CardDescription>Customer and delivery information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Customer</p>
                <p className="text-sm text-muted-foreground">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">Customer ID: {order.userId}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Shipping Address</p>
                <p className="text-sm text-muted-foreground">{order.shipAddress}</p>
                <p className="text-sm text-muted-foreground">
                  {order.shipCity}, {order.shipPostalCode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Products included in this order</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage || "/placeholder.svg?height=40&width=40"}
                        alt={item.productName}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <span className="font-medium">{item.productName}</span>
                    </div>
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            {order.items.reduce((total, item) => total + item.quantity, 0)} items
          </div>
          <div className="text-base font-medium">
            Total: <span className="font-bold">${order.totalPrice.toFixed(2)}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
