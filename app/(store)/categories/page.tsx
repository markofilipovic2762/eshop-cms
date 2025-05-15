import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories, getSubcategories, uploadsUrl } from "@/lib/api";

export const metadata = {
  title: "Categories | Your Store",
  description: "Browse all product categories in our store",
};

async function CategoriesContent() {
    const categories = await getCategories();

  // Group subcategories by category
//   const subcategoriesByCategory = subcategories.reduce((acc, subcategory) => {
//     if (!acc[subcategory.categoryId]) {
//       acc[subcategory.categoryId] = [];
//     }
//     acc[subcategory.categoryId].push(subcategory);
//     return acc;
//   }, {} as Record<string, any[]>);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="overflow-hidden transition-all hover:shadow-md"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{category.name}</CardTitle>
              <Link
                href={`/products?category=${category.id}`}
                className="flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <CardDescription>
              {category.name || `Browse all ${category.name} products`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video overflow-hidden rounded-md bg-muted">
              <img
                src={
                  uploadsUrl + category.imageUrl ||
                  `/placeholder.jpg`
                }
                alt={category.name}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>

            {category.subcategories &&
              category.subcategories.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                    Subcategories:
                  </h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory.id}>
                        <Link
                          href={`/products?subcategory=${subcategory.id}`}
                          className="inline-block rounded-md px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          {subcategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full rounded-md" />
            <div className="mt-4">
              <Skeleton className="mb-2 h-4 w-1/3" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-md" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Product Categories</h1>
        <p className="text-muted-foreground">
          Browse all categories and find what you're looking for
        </p>
      </div>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesContent />
      </Suspense>
    </div>
  );
}
