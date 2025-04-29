"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/store/cart-provider"
import { getProduct, /*getRelatedProducts*/ } from "@/lib/api"
import { ProductGrid } from "@/components/store/product-grid"
import { ArrowLeft, Minus, Plus, ShoppingCart, Heart } from "lucide-react"

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const productData = await getProduct(Number.parseInt(params.id))
        setProduct(productData)

        // Fetch related products from same category
        // if (productData.category.id) {
        //   const related = await getRelatedProducts(productData.category.id, productData.id)
        //   setRelatedProducts(related)
        // }
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.imageUrl,
      })

      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
      })
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < (product?.amount || 10)) {
      setQuantity(quantity + 1)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to products
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mb-6 mt-2 text-muted-foreground">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/products">Browse all products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to products
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="rounded-lg border bg-background p-2">
          <img
            src={product.imageUrl || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            className="h-full w-full rounded-md object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className={product.amount > 0 ? "text-green-600" : "text-red-600"}>
                  {product.amount > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium">Description</h2>
            <p className="mt-2 text-muted-foreground">
              {product.description || "No description available for this product."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={increaseQuantity} disabled={quantity >= product.amount}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" onClick={handleAddToCart} disabled={product.amount <= 0}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{product.categoryName}</p>
                </div>
                {product.subcategoryName && (
                  <div>
                    <p className="text-sm font-medium">Subcategory</p>
                    <p className="text-sm text-muted-foreground">{product.subcategoryName}</p>
                  </div>
                )}
                {product.supplierName && (
                  <div>
                    <p className="text-sm font-medium">Brand</p>
                    <p className="text-sm text-muted-foreground">{product.supplierName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">SKU</p>
                  <p className="text-sm text-muted-foreground">PRD-{product.id.toString().padStart(4, "0")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">You might also like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  )
}
