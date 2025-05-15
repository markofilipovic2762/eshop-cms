import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CategoriesLoading() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="mt-2 h-5 w-2/3" />
      </div>

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
    </div>
  );
}
