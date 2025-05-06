"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, ImagePlus } from "lucide-react"
import { getProduct, getCategories, getSubcategories, getSuppliers, updateProduct, uploadsUrl } from "@/lib/api"
import axios from "axios"

type Category = {
  id: number
  name: string
}

type Subcategory = {
  id: number
  name: string
  categoryId: number
}

type Supplier = {
  id: number
  name: string
}

type ProductFormData = {
  name: string
  description: string
  price: string
  amount: string
  categoryId: string
  subcategoryId: string
  supplierId: string
  imageUrl: string
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])
  const [imagePreview, setImagePreview] = useState<string>("/placeholder.svg?height=200&width=200")

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    amount: "",
    categoryId: "",
    subcategoryId: "",
    supplierId: "",
    imageUrl: "/placeholder.svg?height=200&width=200",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoriesData, subcategoriesData, suppliersData] = await Promise.all([
          getProduct(Number.parseInt(params.id)),
          getCategories(),
          getSubcategories(),
          getSuppliers(),
        ])

        setCategories(categoriesData)
        setSubcategories(subcategoriesData)
        setSuppliers(suppliersData)

        // Set form data from product
        setFormData({
          name: productData.name,
          description: productData.description || "",
          price: productData.price.toString(),
          amount: productData.amount.toString(),
          categoryId: productData.category.id.toString(),
          subcategoryId: productData.subcategory.id.toString(),
          supplierId: productData.supplier? productData.supplier.id.toString() : "",
          imageUrl: productData.imageUrl || "/placeholder.svg?height=200&width=200",
        })

        setImagePreview(uploadsUrl+productData.imageUrl)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch product data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  // Filter subcategories when category changes
  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subcategories.filter((subcategory) => subcategory.categoryId === Number(formData.categoryId))
      setFilteredSubcategories(filtered)

      // Reset subcategory selection if current selection doesn't belong to the selected category
      if (formData.subcategoryId && !filtered.some((s) => s.id === Number(formData.subcategoryId))) {
        setFormData((prev) => ({ ...prev, subcategoryId: "" }))
      }
    } else {
      setFilteredSubcategories([])
      setFormData((prev) => ({ ...prev, subcategoryId: "" }))
    }
  }, [formData.categoryId, subcategories, formData.subcategoryId])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    if (file.size > 2 * 1024 * 1024) {
        toast({
            title: "File Size Error",
            description: "File size exceeds 2MB. Please upload a smaller file.",
            variant: "destructive",
            });
        return;
    }
      const formDejta = new FormData();
      formDejta.append("file", file);
      let image: string = "";
        
      try {
        const response = await axios.post("http://localhost:5056/products/upload", formDejta, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image uploaded:", response.data);
        image = response.data
      } catch (error) {
        console.error("Error uploading image:", error);
      }
      setImagePreview(uploadsUrl+image);
      setFormData({
        ...formData,
        imageUrl: image
      });
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.price || !formData.amount || !formData.categoryId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Convert string values to numbers where needed
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        amount: Number.parseInt(formData.amount),
        categoryId: Number.parseInt(formData.categoryId),
        subcategoryId: Number.parseInt(formData.subcategoryId),
        supplierId: Number.parseInt(formData.supplierId)
      }

      await updateProduct(Number.parseInt(params.id), productData)

      toast({
        title: "Success",
        description: "Product updated successfully.",
      })
      router.push("/dashboard/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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

        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-5 w-60" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Skeleton className="h-40 w-40 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-32 w-full" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Update your product details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Image */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="image" className="cursor-pointer">
                    <div className="flex h-10 items-center justify-center rounded-md border border-dashed px-4 py-2 text-sm hover:bg-muted">
                      <ImagePlus className="mr-2 h-4 w-4" />
                      <span>Change Image</span>
                    </div>
                    <Input id="image" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                  </Label>
                  <p className="text-xs text-muted-foreground">Recommended size: 800x800px. Max size: 2MB.</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Wireless Headphones"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your product..."
                className="min-h-32"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Stock Quantity *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Categories and Supplier */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
                        No categories found
                      </div>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select
                  value={formData.subcategoryId}
                  onValueChange={(value) => setFormData({ ...formData, subcategoryId: value })}
                  disabled={!formData.categoryId || filteredSubcategories.length === 0}
                >
                  <SelectTrigger id="subcategory">
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubcategories.length === 0 ? (
                      <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
                        {formData.categoryId ? "No subcategories found" : "Select a category first"}
                      </div>
                    ) : (
                      filteredSubcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                          {subcategory.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select
                value={formData.supplierId}
                onValueChange={(value) => setFormData({ ...formData, supplierId: value })}
              >
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.length === 0 ? (
                    <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
                      No suppliers found
                    </div>
                  ) : (
                    suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
