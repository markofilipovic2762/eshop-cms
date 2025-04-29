import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-muted/40">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Summer Sale <span className="text-primary">2023</span>
            </h1>
            <p className="mt-4 max-w-md text-xl text-muted-foreground">
              Discover amazing deals on our latest products. Up to 50% off on selected items.
            </p>
            <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products?category=1">New Arrivals</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="Summer Sale"
              className="h-auto max-w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
