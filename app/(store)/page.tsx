import { HeroSection } from "@/components/store/hero-section";
import { CategoryGrid } from "@/components/store/category-grid";
import { FeaturedProducts } from "@/components/store/featured-products";
import { PromoSection } from "@/components/store/promo-section";
import { Newsletter } from "@/components/store/newsletter";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts title="New Arrivals" />
      <PromoSection />
      <FeaturedProducts title="Best Sellers" />
      <Newsletter />
    </div>
  );
}
