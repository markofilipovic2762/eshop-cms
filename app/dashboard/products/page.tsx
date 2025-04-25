"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Package, Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"

type Product = {
  id: number
  name: string
  description: string
  price: number
  amount: number
  sold: number
  imageUrl: string
  categoryId: number
  categoryName: string
  subcategoryId: number
  subcategoryName: string
  supplierId: number | null
  supplierName: string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For demo purposes, we'll use mock data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Wireless Headphones",
        description: "Premium wireless headphones with noise cancellation",
        price: 89.99,
        amount: 45,
        sold: 142,
        imageUrl: "/placeholder.svg?height=80&width=80",
        categoryId: 1,
        categoryName: "Electronics",
        subcategoryId: 1,
        subcategoryName: "Audio",
        supplierId: 1,
        supplierName: "Tech Supplies Inc.",
      },
      {
        id: 2,
        name: "Smart Watch",
        description: "Fitness tracker and smartwatch with heart rate monitor",
        price: 199.99,
        amount: 28,
        sold: 98,
        imageUrl: "/placeholder.svg?height=80&width=80",
        categoryId: 1,
        categoryName: "Electronics",
        subcategoryId: 2,
        subcategoryName: "Wearables",
        supplierId: 1,
        supplierName: "Tech Supplies Inc.",
      },
      {
        id: 3,
        name: "Running Shoes",
        description: "Lightweight running shoes with cushioned soles",
        price: 79.95,
        amount: 60,
        sold: 87,
        imageUrl: "/placeholder.svg?height=80&width=80",
        categoryId: 2,
        categoryName: "Footwear",
        subcategoryId: 3,
        subcategoryName: "Athletic",
        supplierId: 2,
        supplierName: "Sports Gear Ltd.",
      },
      {
        id: 4,
        name: "Coffee Maker",
        description: "Programmable coffee maker with thermal carafe",
        price: 129.99,
        amount: 32,
        sold: 65,
        imageUrl: "/placeholder.svg?height=80&width=80",
        categoryId: 3,
        categoryName: "Kitchen",
        subcategoryId: 4,
        subcategoryName: "Appliances",
        supplierId: 3,
        supplierName: "Home Essentials Co.",
      },
      {
        id: 5,
        name: "Backpack",
        description: "Water-resistant backpack with laptop compartment",
        price: 49.99,
        amount: 75,
        sold: 54,
        imageUrl: "/placeholder.svg?height=80&width=80",
        categoryId: 4,
        categoryName: "Accessories",
        subcategoryId: 5,
        subcategoryName: "Bags",
        supplierId: 4,
        supplierName: "Fashion Distributors",
      },
    ]

    setProducts(mockProducts)
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.categoryName === categoryFilter

    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.map((product) => product.categoryName)))

  const handleDeleteProduct = (id: number) => {
    // In a real app, you would call your API to delete the product
    setProducts(products.filter((product) => product.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory and details</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-lg font-medium">No products found</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{product.categoryName}</span>
                      <span className="text-xs text-muted-foreground">{product.subcategoryName}</span>
                    </div>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.amount}</TableCell>
                  <TableCell>{product.sold}</TableCell>
                  <TableCell>{product.supplierName || "—"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/products/${product.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/products/${product.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
