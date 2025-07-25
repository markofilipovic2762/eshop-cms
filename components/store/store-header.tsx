"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-provider";
import { useCart } from "@/components/store/cart-provider";
import { useWishlist } from "@/components/store/wishlist-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ShoppingBag,
  Menu,
  Search,
  User,
  ShoppingCart,
  Heart,
  LogIn,
} from "lucide-react";

export function StoreHeader() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistItemsCount = wishlist.length;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-gradient-primary"
      }`}
    >
      {/* Top bar with search, account, cart */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <ShoppingBag
                className={`h-6 w-6 ${
                  isScrolled ? "text-primary" : "text-white"
                }`}
              />
              <span
                className={`ml-2 text-xl font-bold ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                ShopSmart
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-white/90 ${
                  isScrolled
                    ? pathname === item.href
                      ? "text-primary"
                      : "text-foreground/70"
                    : "text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search, account, cart */}
          <div className="flex items-center space-x-4">
            {/* Desktop search */}
            <form onSubmit={handleSearch} className="hidden md:flex md:w-72">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-8 bg-white/90 backdrop-blur-sm dark:text-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${isScrolled ? "" : "text-white"}`}
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle
              variant="ghost"
              className={isScrolled ? "" : "text-white"}
            />

            {/* Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={isScrolled ? "" : "text-white"}
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account?tab=orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  {user?.name === "Admin User" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={isScrolled ? "" : "text-white"}
              >
                <Link href="/login">
                  <LogIn className="h-5 w-5" />
                  <span className="sr-only">Login</span>
                </Link>
              </Button>
            )}

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={`relative ${isScrolled ? "" : "text-white"}`}
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {wishlistItemsCount}
                  </span>
                )}
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={`relative ${isScrolled ? "" : "text-white"}`}
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs text-white">
                    {cartItemsCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`md:hidden ${isScrolled ? "" : "text-white"}`}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 py-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4">
                    {isAuthenticated ? (
                      <>
                        <Link
                          href="/account"
                          className="flex items-center py-2"
                        >
                          <User className="mr-2 h-5 w-5" />
                          My Account
                        </Link>
                        <Link
                          href="/account?tab=orders"
                          className="flex items-center py-2"
                        >
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          My Orders
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="flex items-center py-2">
                          <LogIn className="mr-2 h-5 w-5" />
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          className="flex items-center py-2"
                        >
                          <User className="mr-2 h-5 w-5" />
                          Register
                        </Link>
                      </>
                    )}
                    <Link
                      href="/wishlist"
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center">
                        <Heart className="mr-2 h-5 w-5" />
                        Wishlist
                      </div>
                      {wishlistItemsCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                          {wishlistItemsCount}
                        </span>
                      )}
                    </Link>
                    <div className="flex items-center justify-between py-2">
                      <span>Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {isMobileSearchOpen && (
        <div className="border-t py-2 md:hidden">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
