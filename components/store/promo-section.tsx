import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PromoSection() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="group relative overflow-hidden rounded-lg">
          <img
            src="/placeholder.svg?height=300&width=600&text=Electronics"
            alt="Electronics Sale"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-r from-black/70 to-transparent p-8 text-white">
            <h3 className="text-2xl font-bold">Electronics Sale</h3>
            <p className="mb-4 max-w-xs">Save up to 30% on the latest gadgets and tech accessories.</p>
            <Button asChild>
              <Link href="/products?category=1">Shop Now</Link>
            </Button>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-lg">
          <img
            src="/placeholder.svg?height=300&width=600&text=Accessories"
            alt="Accessories Collection"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-r from-black/70 to-transparent p-8 text-white">
            <h3 className="text-2xl font-bold">Accessories Collection</h3>
            <p className="mb-4 max-w-xs">Discover our new range of stylish accessories for every occasion.</p>
            <Button asChild>
              <Link href="/products?category=4">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
