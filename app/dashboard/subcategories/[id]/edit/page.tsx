"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import { getCategories, getSubcategory, updateSubcategory } from "@/lib/api"

type Category = {
  id: number
  name: string
}

type SubcategoryFormData = {
  name: string
  categoryId: string
}

export default function EditSubcategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<SubcategoryFormData>({
    name: "",
    categoryId: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        const [subcategoryData, categoriesData] = await Promise.all([
          getSubcategory(Number.parseInt(params.id)),
          getCategories(),
        ])

        setFormData({
          name: subcategoryData.name,
          categoryId: subcategoryData.categoryId.toString(),
        })
        setCategories(categoriesData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.categoryId) {
      toast({
        title: "Validation Error",
        description: "Please select a parent category.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      await updateSubcategory(Number.parseInt(params.id), {
        name: formData.name,
        categoryId: Number.parseInt(formData.categoryId),
      })

      toast({
        title: "Success",
        description: "Subcategory updated successfully.",
      })
      router.push("/dashboard/subcategories")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subcategory. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/dashboard/subcategories">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Subcategory</h1>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-between pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Subcategory Information</CardTitle>
              <CardDescription>Update the subcategory details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subcategory Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Smartphones, Running Shoes, Fiction Books"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Parent Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a parent category" />
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard/subcategories">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Subcategory"
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
