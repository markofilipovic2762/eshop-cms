"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Edit, Mail, MapPin, Phone, Truck } from "lucide-react"
import { getSupplier, getProducts } from "@/lib/api"

type Supplier = {
  id: number
  name: string
  phone: string
  email: string
  address: string
  city: string
}

type Product = {
  id: number
  name: string
  price: number
  amount: number
  imageUrl: string
  supplierId: number | null
}

export default function SupplierDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        const [supplierData, productsData] = await Promise.all([getSupplier(Number.parseInt(params.id)), getProducts()])

        setSupplier(supplierData)

        // Filter products by supplier ID
        const supplierProducts = productsData.filter(
          (product: Product) => product.supplierId === Number.parseInt(params.id),
        )
        setProducts(supplierProducts)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch supplier details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

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
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <Truck className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Supplier Not Found</h2>
        <p className="text-muted-foreground">The supplier you're looking for doesn't exist.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/suppliers">Back to Suppliers</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard/suppliers">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{supplier.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/dashboard/suppliers/${params.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Supplier
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Details for contacting this supplier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{supplier.email}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{supplier.phone}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{supplier.address}</p>
                <p className="text-sm text-muted-foreground">{supplier.city}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Products supplied by this vendor</CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Truck className="h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">No products from this supplier</p>
                <p className="text-xs text-muted-foreground">
                  This supplier doesn't have any products in your inventory yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.imageUrl || "/placeholder.svg?height=40&width=40"}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${product.price.toFixed(2)} · {product.amount} in stock
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/products/${product.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
                {products.length > 5 && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/products?supplier=${params.id}`}>View all {products.length} products</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
