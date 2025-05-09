"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/components/store/cart-provider";
import { useWishlist } from "@/components/store/wishlist-provider";
import { ProductGrid } from "@/components/store/product-grid";
import { getProduct, getRelatedProducts, uploadsUrl } from "@/lib/api";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Expand,
} from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const productId = Number(params.id);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  // Image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productData = await getProduct(productId);
        setProduct(productData);

        // Fetch related products
        if (productData.category.id) {
          const related = await getRelatedProducts(
            productData.category.id,
            productId
          );
          setRelatedProducts(related as any[]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, toast]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.imageUrl[0] || "/placeholder.png",
    });

    setAddedToCart(true);

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });

    // Reset the "Added" state after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrls: product.imageUrls,
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

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Image carousel navigation
  const nextImage = () => {
    if (!product || !product.imageUrls) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!product || !product.imageUrls) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Get current image URL
  const getCurrentImageUrl = () => {
    if (!product) return null;

    if (product.imageUrls && product.imageUrls.length > 0) {
      return uploadsUrl + product.imageUrls[currentImageIndex];
    }

    return uploadsUrl + product.imageUrl || "/placeholder.jpg";
  };

  // Get all image URLs
  const getImageUrls = () => {
    if (!product) return [];

    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls;
    }

    return product.imageUrls ? [product.imageUrls] : ["/placeholder.jpg"];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="mb-2 text-2xl font-bold">Product Not Found</h2>
          <p className="mb-6 text-muted-foreground">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const imageUrls = getImageUrls();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Image Carousel */}
        <div className="space-y-4">
          <div
            className={`relative overflow-hidden rounded-lg bg-muted transition-all duration-300 ${
              isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={toggleZoom}
          >
            <div
              className={`relative aspect-square ${
                isZoomed ? "scale-150 transition-all duration-300" : ""
              }`}
            >
              <img
                src={getCurrentImageUrl() || "/placeholder.jpg"}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                className={`h-full w-full object-contain transition-transform duration-300 ${
                  isZoomed ? "scale-100" : "scale-90 hover:scale-100"
                }`}
              />
            </div>

            {/* Image navigation controls */}
            {imageUrls.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 opacity-80 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 opacity-80 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 rounded-full bg-background/80 p-2 opacity-80 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleZoom();
                  }}
                >
                  <Expand className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {imageUrls.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {imageUrls.map((url, index) => (
                <button
                  key={index}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground/50"
                  }`}
                  onClick={() => goToImage(index)}
                >
                  <img
                    src={uploadsUrl + url || "/placeholder.svg"}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center">
            <Link
              href={`/products?category=${product.category.id}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {product.category.name}
            </Link>
            {product.subcategory.name && (
              <>
                <span className="mx-2 text-muted-foreground">/</span>
                <Link
                  href={`/products?subcategory=${product.subcategoryId}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {product.subcategory.name}
                </Link>
              </>
            )}
          </div>

          <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>

          <div className="mb-4 flex items-center">
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2 text-lg line-through text-muted-foreground">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="mb-6 text-muted-foreground">{product.description}</p>

          {/* Quantity Selector */}
          <div className="mb-6">
            <p className="mb-2 font-medium">Quantity</p>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-r-none"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex h-10 w-14 items-center justify-center border-y border-input bg-transparent text-center">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-l-none"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart and Wishlist */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              className="flex-1 transition-all duration-300"
              size="lg"
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`transition-all duration-300 ${
                isInWishlist(product.id)
                  ? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50"
                  : ""
              }`}
              onClick={handleToggleWishlist}
            >
              <Heart
                className="mr-2 h-5 w-5"
                fill={isInWishlist(product.id) ? "currentColor" : "none"}
              />
              {isInWishlist(product.id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8">
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  Details
                </TabsTrigger>
                <TabsTrigger value="shipping" className="flex-1">
                  Shipping
                </TabsTrigger>
                <TabsTrigger value="returns" className="flex-1">
                  Returns
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Brand</span>
                    <span>{product.supplier?.name || "Generic"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="font-medium">In Stock</span>
                    <span>
                      {product.amount > 0
                        ? `${product.amount} units`
                        : "Out of stock"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="font-medium">SKU</span>
                    <span>PRD-{product.id.toString().padStart(5, "0")}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="mt-4">
                <div className="space-y-4">
                  <p>
                    Free shipping on orders over $50. Standard shipping takes
                    3-5 business days.
                  </p>
                  <p>
                    Express shipping available at checkout for an additional
                    fee.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="returns" className="mt-4">
                <div className="space-y-4">
                  <p>
                    We accept returns within 30 days of delivery for a full
                    refund.
                  </p>
                  <p>Items must be unused and in original packaging.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
