import { UseFormRegister, FieldErrors } from "react-hook-form";
import { RequestAnimalInput } from "@/lib/validations/animal-request.schema";

interface RequestClassificationSectionProps {
  register: UseFormRegister<RequestAnimalInput>;
  errors: FieldErrors<RequestAnimalInput>;
  classes: { id: string; name: string }[];
}

export default function RequestClassificationSection({ register, errors, classes }: RequestClassificationSectionProps) {
  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm font-['Manrope']">
      <h2 className="flex items-center gap-2 text-md font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] uppercase tracking-wider mb-6 pb-2 border-b border-[#e3e3de]">
        <span className="material-symbols-outlined text-[20px] text-[#2d5a27]">account_tree</span>
        Scientific Classification
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Scientific Name</label>
          <input
            type="text"
            {...register("scientific_name")}
            placeholder="e.g. Ailurus fulgens"
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Animal Class</label>
          <select
            {...register("class_id")}
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          >
            <option value="">Select a Class...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Family</label>
          <input
            type="text"
            {...register("family")}
            placeholder="e.g. Ailuridae"
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">Genus</label>
          <input
            type="text"
            {...register("genus")}
            placeholder="e.g. Ailurus"
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-sm bg-[#fafaf5]/50"
          />
        </div>
      </div>
    </section>
  );
}
