import type React from "react";
import { StoreHeader } from "@/components/store/store-header";
import { StoreFooter } from "@/components/store/store-footer";
import { CartProvider } from "@/components/store/cart-provider";
import { WishlistProvider } from "@/components/store/wishlist-provider";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="flex min-h-screen flex-col">
          <StoreHeader />
          <main className="flex-1">{children}</main>
          <StoreFooter />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}
