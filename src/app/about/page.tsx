import React from "react";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

export const metadata = {
  title: "About | Arboreal Archive",
  description: "Learn more about the Arboreal Archive project and our data sources.",
};

export default function AboutPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-12 font-['Plus_Jakarta_Sans']">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#154212]">
            About Arboreal Archive
          </h1>
          <p className="text-lg text-[#1a1c19]/80 leading-relaxed">
            A comprehensive, digital encyclopedia dedicated to cataloging the world's most fascinating species, habitats, and ecological regions.
          </p>
        </div>

        {/* Project Mission */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-outline-variant/10">
          <h2 className="text-2xl font-bold text-[#154212] mb-4">
            Our Mission
          </h2>
          <p className="text-base text-[#1a1c19]/80 leading-relaxed">
            The Arboreal Archive aims to foster global awareness and education about biodiversity. By centralizing high-fidelity ecological data, we provide a premium, interactive research experience for conservationists, students, and wildlife enthusiasts alike.
          </p>
        </div>

        {/* Data & Image Sources (Attribution) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#154212]">
            Data & Media Attributions
          </h2>
          <p className="text-base text-[#1a1c19]/80 leading-relaxed">
            To ensure accuracy and richness, a majority of the biological specifications, historical records, and media content hosted on this platform are aggregated from open knowledge repositories.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-[#fafaf5] rounded-2xl border border-outline-variant/20 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary">menu_book</span>
                <h3 className="text-lg font-semibold text-[#1a1c19]">Wikipedia</h3>
              </div>
              <p className="text-sm text-[#1a1c19]/60">
                Text descriptions, taxonomy trees, and core metrics are sourced under the Creative Commons License.
              </p>
            </div>

            <div className="p-6 bg-[#fafaf5] rounded-2xl border border-outline-variant/20 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary">photo_library</span>
                <h3 className="text-lg font-semibold text-[#1a1c19]">Wikimedia Commons</h3>
              </div>
              <p className="text-sm text-[#1a1c19]/60">
                A large percentage of species photography is sourced via open public domain or fair-use attribution agreements.
              </p>
            </div>
          </div>
        </div>

        {/* Hosting */}
        <div className="pt-6 border-t border-outline-variant/20">
          <p className="text-xs text-[#1a1c19]/40 text-center">
            Images hosted securely via ImgBB CDN.
            All rights reserved to their respective creators.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
