import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Teaser from "@/components/landing/Teaser";
import Stats from "@/components/landing/Stats";
import Explore from "@/components/landing/Explore";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <Teaser />
        <Stats />
        <Explore />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
