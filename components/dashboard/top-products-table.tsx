"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink } from "lucide-react"

type Product = {
  id: number
  name: string
  category: string
  price: number
  sold: number
}

export function TopProductsTable() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For demo purposes, we'll use mock data
    setProducts([
      {
        id: 101,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 89.99,
        sold: 142,
      },
      {
        id: 102,
        name: "Smart Watch",
        category: "Electronics",
        price: 199.99,
        sold: 98,
      },
      {
        id: 103,
        name: "Running Shoes",
        category: "Footwear",
        price: 79.95,
        sold: 87,
      },
      {
        id: 104,
        name: "Coffee Maker",
        category: "Kitchen",
        price: 129.99,
        sold: 65,
      },
      {
        id: 105,
        name: "Backpack",
        category: "Accessories",
        price: 49.99,
        sold: 54,
      },
    ])
  }, [])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Sold</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">{product.sold}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center p-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="/dashboard/products">
            View all products
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
