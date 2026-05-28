import HeroSearch from "@/components/features/dashboard/hero-search";
import QuickActions from "@/components/features/dashboard/quick-actions";
import FeaturedBanner from "@/components/features/dashboard/featured-banner";
import QuizNav from "@/components/features/dashboard/quiz-nav";
import EcosystemGrid from "@/components/features/dashboard/ecosystem-grid";
import TrendingAnimals from "@/components/features/dashboard/trending-animals";
import StatsBar from "@/components/features/dashboard/stats-bar";
export default async function DashboardPage() {
  return (
    <div className="space-y-12">
      <HeroSearch />
      <QuickActions />
      <FeaturedBanner />
      <QuizNav />
      <EcosystemGrid />
      <TrendingAnimals />
      <StatsBar />

      {/* Footer Spacing matches the template */}
    </div>
  );
}
