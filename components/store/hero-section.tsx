import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="animated-gradient-bg absolute inset-0 opacity-20"></div>
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Discover Amazing Products for Your Lifestyle
            </h1>
            <p className="text-xl text-muted-foreground">
              Shop the latest trends with confidence. Quality products,
              competitive prices, and exceptional service.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              <img
                src="/hero-img.jpg"
                alt="Featured Products"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-gradient-primary"></div>
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-secondary"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
