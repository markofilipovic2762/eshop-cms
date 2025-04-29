import { FeaturedProducts } from "@/components/store/featured-products"
import { CategoryGrid } from "@/components/store/category-grid"
import { HeroSection } from "@/components/store/hero-section"
import { PromoSection } from "@/components/store/promo-section"
import { Newsletter } from "@/components/store/newsletter"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 pb-8">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts title="Best Sellers" />
      <PromoSection />
      <FeaturedProducts title="New Arrivals" />
      <Newsletter />
    </div>
  )
}
