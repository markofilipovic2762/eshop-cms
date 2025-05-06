"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/store/product-grid";
import { getProducts } from "@/lib/api";
import { Product } from "@/app/dashboard/products/page";

interface FeaturedProductsProps {
  title: string;
}

export function FeaturedProducts({ title }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product []>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        // For "Best Sellers", sort by sold count
        if (title === "Best Sellers") {
          data.sort((a: any, b: any) => b.sold - a.sold);
        }

        // For "New Arrivals", sort by id (assuming newer products have higher ids)
        if (title === "New Arrivals") {
          data.sort((a: any, b: any) => b.id - a.id);
        }


        setProducts(data.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [title]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {title}
        </h2>
        <Button variant="gradient" asChild>
          <Link href="/products">View All</Link>
        </Button>
      </div>

      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
}
