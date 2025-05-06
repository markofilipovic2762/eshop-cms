"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useWishlist } from "@/components/store/wishlist-provider";
import { useCart } from "@/components/store/cart-provider";
import {
  ShoppingCart,
  Trash2,
  Heart,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { uploadsUrl } from "@/lib/api";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [addedToCart, setAddedToCart] = useState<Record<number, boolean>>({});

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });

    setAddedToCart({ ...addedToCart, [item.id]: true });

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });

    // Reset the "Added" state after 2 seconds
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [item.id]: false });
    }, 2000);
  };

  const handleRemoveFromWishlist = (id: number, name: string) => {
    removeFromWishlist(id);

    toast({
      title: "Removed from wishlist",
      description: `${name} has been removed from your wishlist.`,
    });
  };

  const handleClearWishlist = () => {
    clearWishlist();

    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="mt-2 text-muted-foreground">
          Items you've saved for later. Add them to your cart when you're ready
          to purchase.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-6">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">Your wishlist is empty</h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            Browse our products and click the heart icon to save items to your
            wishlist.
          </p>
          <Button asChild variant="gradient">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              {wishlist.length} item(s) in your wishlist
            </p>
            <Button variant="outline" size="sm" onClick={handleClearWishlist}>
              Clear Wishlist
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-md"
                gradient
            >
                <Link href={`/products/${item.id}`}>
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted">
                      <img
                        src={
                          uploadsUrl + item.image ||
                          uploadsUrl + "placeholder.png"
                        }
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </CardContent>
                </Link>
                <CardFooter className="flex flex-col items-start p-4">
                  <Link
                    href={`/products/${item.id}`}
                    className="hover:underline"
                  >
                    <h3 className="font-medium transition-colors duration-200 group-hover:text-primary">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="mb-4 text-lg font-bold text-primary">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex w-full gap-2">
                    <Button
                      className="flex-1 transition-all duration-300"
                      size="sm"
                      variant={addedToCart[item.id] ? "outline" : "gradient"}
                      onClick={() => handleAddToCart(item)}
                    >
                      {addedToCart[item.id] ? (
                        <>Added to Cart</>
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
                      className="flex-none text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() =>
                        handleRemoveFromWishlist(item.id, item.name)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
