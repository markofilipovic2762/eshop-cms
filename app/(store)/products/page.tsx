"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductGrid } from "@/components/store/product-grid"
import { ProductFilters } from "@/components/store/product-filters"
import { ProductSort } from "@/components/store/product-sort"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getProducts, getCategories } from "@/lib/api"
import { FilterIcon } from "lucide-react"
import { Product } from "@/app/dashboard/products/page"
import { Category } from "@/app/dashboard/categories/page"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const categoryParam = searchParams.get("category")
  const searchParam = searchParams.get("search")
  const sortParam = searchParams.get("sort") || "featured"

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [productsData, categoriesData] = await Promise.all([getProducts(), getCategories()])

        let filteredProducts = [...productsData]

        // Apply category filter
        if (categoryParam) {
          filteredProducts = filteredProducts.filter((product) => product.category.id.toString() === categoryParam)
        }

        // Apply search filter
        if (searchParam) {
          const searchLower = searchParam.toLowerCase()
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(searchLower) ||
              product.description.toLowerCase().includes(searchLower),
          )
        }

        // Apply sorting
        if (sortParam) {
          switch (sortParam) {
            case "price-low":
              filteredProducts.sort((a, b) => a.price - b.price)
              break
            case "price-high":
              filteredProducts.sort((a, b) => b.price - a.price)
              break
            case "newest":
              // In a real app, you would sort by date
              filteredProducts.sort((a, b) => b.id - a.id)
              break
            default:
              // 'featured' - no specific sort
              break
          }
        }

        setProducts(filteredProducts)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [categoryParam, searchParam, sortParam])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {categoryParam
            ? categories.find((c) => c.id.toString() === categoryParam)?.name || "Products"
            : searchParam
              ? `Search results for "${searchParam}"`
              : "All Products"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isLoading ? "Loading products..." : `${products.length} products found`}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Mobile filter toggle */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4" />
            Filters
          </Button>
          <ProductSort />
        </div>

        {/* Filters - desktop always visible, mobile toggleable */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block lg:col-span-1`}>
          <ProductFilters categories={categories} />
        </div>

        {/* Products grid */}
        <div className="lg:col-span-3">
          <div className="hidden lg:flex lg:justify-end lg:mb-4">
            <ProductSort />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <Skeleton className="h-48 w-full rounded-md" />
                  <Skeleton className="mt-4 h-6 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                  <Skeleton className="mt-4 h-8 w-28" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-medium">No products found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  )
}
