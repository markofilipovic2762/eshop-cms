import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Heart } from "lucide-react"
import { uploadsUrl } from "@/lib/api"

interface ProductGridProps {
  products: any[]
  isLoading?: boolean
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="aspect-square" />
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="mb-4 h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-medium">No products found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters or search term</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
          <Link href={`/products/${product.id}`}>
            <CardContent className="p-0">
              <div className="aspect-square bg-muted">
                <img
                  src={ product.imageUrl ? (uploadsUrl+"/"+product.imageUrl) : `${uploadsUrl}/placeholder.png`}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Link>
          <CardFooter className="flex flex-col items-start p-4">
            <Link href={`/products/${product.id}`} className="hover:underline">
              <h3 className="font-medium">{product.name}</h3>
            </Link>
            <p className="mb-4 text-lg font-bold">${product.price.toFixed(2)}</p>
            <div className="flex w-full gap-2">
              <Button className="flex-1" size="sm" asChild>
                <Link href={`/products/${product.id}`}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-none">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
