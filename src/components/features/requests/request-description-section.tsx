import { UseFormRegister } from "react-hook-form";
import { RequestAnimalInput } from "@/lib/validations/animal-request.schema";

interface RequestDescriptionSectionProps {
  register: UseFormRegister<RequestAnimalInput>;
}

export default function RequestDescriptionSection({ register }: RequestDescriptionSectionProps) {
  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm font-['Manrope']">
      <h2 className="flex items-center gap-2 text-md font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] uppercase tracking-wider mb-6 pb-2 border-b border-[#e3e3de]">
        <span className="material-symbols-outlined text-[20px] text-[#2d5a27]">description</span>
        Description & Summary
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Summary Description</label>
          <textarea
            {...register("description")}
            rows={5}
            placeholder="Write a brief overview of the animal, its behavior, unique features, or ecological role..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50 font-['Manrope']"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Information Source Link</label>
          <input
            type="text"
            {...register("description_source")}
            placeholder="e.g. https://en.wikipedia.org/wiki/Red_panda"
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          />
        </div>
      </div>
    </section>
  );
}
