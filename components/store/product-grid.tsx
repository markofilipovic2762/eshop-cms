"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Heart, Check, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/components/store/cart-provider";
import { useWishlist } from "@/components/store/wishlist-provider";
import { uploadsUrl } from "@/lib/api";

interface ProductGridProps {
  products: any[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState<Record<number, boolean>>({});

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imageUrl,
    });

    setAddedToCart({ ...addedToCart, [product.id]: true });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });

    // Reset the "Added" state after 2 seconds
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [product.id]: false });
    }, 2000);
  };

  const handleToggleWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      description: product.description,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
    });

    toast({
      title: isInWishlist(product.id)
        ? "Removed from wishlist"
        : "Added to wishlist",
      description: `${product.name} has been ${
        isInWishlist(product.id) ? "removed from" : "added to"
      } your wishlist.`,
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden" gradient>
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
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-medium">No products found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your filters or search term
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          gradient
          onMouseEnter={() => setHoveredProduct(product.id)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          <Link href={`/products/${product.id}`}>
            <CardContent className="p-0">
              <div className="aspect-square bg-muted overflow-hidden">
                <img
                  src={
                    uploadsUrl + product.imageUrl ||
                    uploadsUrl + "placeholder.png"
                  }
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Quick action overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-white/90 text-black hover:bg-white"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      {addedToCart[product.id] ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`rounded-full bg-white/90 hover:bg-white ${
                        isInWishlist(product.id) ? "text-red-500" : "text-black"
                      }`}
                      onClick={(e) => handleToggleWishlist(product, e)}
                    >
                      <Heart
                        className="h-4 w-4"
                        fill={
                          isInWishlist(product.id) ? "currentColor" : "none"
                        }
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-white/90 text-black hover:bg-white"
                      asChild
                    >
                      <Link href={`/products/${product.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
          <CardFooter className="flex flex-col items-start p-4">
            <Link href={`/products/${product.id}`} className="hover:underline">
              <h3 className="font-medium transition-colors duration-200 group-hover:text-primary">
                {product.name}
              </h3>
            </Link>
            <p className="mb-4 text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="ml-2 text-sm line-through text-muted-foreground">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
            </p>
            <div className="flex w-full gap-2">
              <Button
                className="flex-1 transition-all duration-300 hover:scale-105"
                size="sm"
                variant="gradient"
                onClick={(e) => handleAddToCart(product, e)}
              >
                {addedToCart[product.id] ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`flex-none transition-all duration-300 ${
                  isInWishlist(product.id)
                    ? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50"
                    : "hover:bg-secondary hover:text-white"
                }`}
                onClick={(e) => handleToggleWishlist(product, e)}
              >
                <Heart
                  className="h-4 w-4"
                  fill={isInWishlist(product.id) ? "currentColor" : "none"}
                />
                <span className="sr-only">
                  {isInWishlist(product.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"}
                </span>
              </Button>
            </div>
          </CardFooter>

          {/* Sale badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-md">
              SALE
            </div>
          )}

          {/* New badge */}
          {product.isNew && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
              NEW
            </div>
          )}

          {/* Wishlist indicator */}
          {isInWishlist(product.id) && !hoveredProduct && (
            <div className="absolute top-2 right-2 bg-white/80 text-red-500 rounded-full p-1.5 shadow-sm">
              <Heart className="h-4 w-4" fill="currentColor" />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
