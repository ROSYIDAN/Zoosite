import { UseFormRegister } from "react-hook-form";
import { RequestAnimalInput } from "@/lib/validations/animal-request.schema";

interface RequestStatsSectionProps {
  register: UseFormRegister<RequestAnimalInput>;
}

export default function RequestStatsSection({ register }: RequestStatsSectionProps) {
  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm font-['Manrope']">
      <h2 className="flex items-center gap-2 text-md font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] uppercase tracking-wider mb-6 pb-2 border-b border-[#e3e3de]">
        <span className="material-symbols-outlined text-[20px] text-[#2d5a27]">monitoring</span>
        Physical & Ecological Stats
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Primary Diet</label>
          <input
            type="text"
            {...register("diet")}
            placeholder="e.g. Herbivore (primarily bamboo), Carnivore"
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Conservation Status</label>
          <input
            type="text"
            {...register("conservation_status")}
            placeholder="e.g. Endangered, Vulnerable, Least Concern"
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Average Lifespan (Years)</label>
          <input
            type="text"
            {...register("lifespan_years")}
            placeholder="e.g. 8 - 15 years"
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Social Structure</label>
          <input
            type="text"
            {...register("social_structure")}
            placeholder="e.g. Solitary, Prides, Packs"
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Weight Range</label>
          <input
            type="text"
            {...register("weight_kg")}
            placeholder="e.g. 3 - 6 kg"
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Height/Length Range</label>
          <input
            type="text"
            {...register("height_cm")}
            placeholder="e.g. 50 - 64 cm"
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Average Speed (km/h)</label>
          <input
            type="text"
            {...register("avg_speed_kmh")}
            placeholder="e.g. 10 - 15 km/h"
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Top Speed (km/h)</label>
          <input
            type="text"
            {...register("top_speed_kmh")}
            placeholder="e.g. 38 km/h"
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          />
        </div>
      </div>
    </section>
  );
}
