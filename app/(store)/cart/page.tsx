"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/store/cart-provider";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { uploadsUrl } from "@/lib/api";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 5.99 : 0;
  const discount = 0; // Would be calculated based on promo code
  const total = subtotal + shipping - discount;

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate the promo code here
    alert(`Promo code "${promoCode}" applied!`);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-6 mt-2 text-center text-muted-foreground">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <div className="hidden border-b pb-4 sm:grid sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <span className="font-medium">Product</span>
                </div>
                <div className="text-center sm:col-span-1">
                  <span className="font-medium">Price</span>
                </div>
                <div className="text-center sm:col-span-1">
                  <span className="font-medium">Quantity</span>
                </div>
                <div className="text-right sm:col-span-1">
                  <span className="font-medium">Total</span>
                </div>
              </div>

              <div className="divide-y">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-6 sm:gap-6"
                  >
                    <div className="flex gap-4 sm:col-span-3">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                        <img
                          src={
                            uploadsUrl + item.image ||
                            uploadsUrl + "placeholder.png"
                          }
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="mt-1 flex items-center text-sm text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:col-span-1 sm:block sm:text-center">
                      <span className="font-medium sm:hidden">Price:</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between sm:col-span-1 sm:flex sm:justify-center">
                      <span className="font-medium sm:hidden">Quantity:</span>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:col-span-1 sm:block sm:text-right">
                      <span className="font-medium sm:hidden">Total:</span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between border-t p-6">
              <Button variant="outline" asChild>
                <Link href="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>

              <Button variant="outline" onClick={clearCart}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="text-lg font-medium">Order Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleApplyPromoCode} className="mt-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button type="submit" variant="outline">
                    Apply
                  </Button>
                </div>
              </form>

              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
