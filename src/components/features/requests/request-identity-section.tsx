import { UseFormRegister, FieldErrors } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { RequestAnimalInput } from "@/lib/validations/animal-request.schema";

interface RequestIdentitySectionProps {
  register: UseFormRegister<RequestAnimalInput>;
  errors: FieldErrors<RequestAnimalInput>;
  isChecking: boolean;
  nameCheckResult: {
    exists: boolean;
    isUnderReview: boolean;
    animal?: { canonical_slug: string; animal_name: string; scientific_name: string; family: string };
    request?: { animal_name: string; status: string };
  } | null;
}

export default function RequestIdentitySection({ register, errors, isChecking, nameCheckResult }: RequestIdentitySectionProps) {
  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm flex flex-col font-['Manrope']">
      <h2 className="flex items-center gap-2 text-md font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] uppercase tracking-wider mb-6 pb-2 border-b border-[#e3e3de]">
        <span className="material-symbols-outlined text-[20px] text-[#2d5a27]">badge</span>
        Animal Identity
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">
            Animal Common Name
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#1a1c19]/30">
              pets
            </span>
            <input
              type="text"
              {...register("animal_name")}
              placeholder="e.g. Red Panda, Platypus, Capybara"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] focus:ring-1 focus:ring-[#2d5a27] outline-none transition-all text-sm bg-[#fafaf5]/50"
            />
            {isChecking && (
              <span className="material-symbols-outlined animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#2d5a27]">
                progress_activity
              </span>
            )}
          </div>
          {errors.animal_name && (
            <p className="text-red-500 text-[11px] mt-1.5 px-1">{errors.animal_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">
            Search Synonyms / Nicknames (Comma Separated)
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#1a1c19]/30">
              alternate_email
            </span>
            <input
              type="text"
              {...register("synonyms")}
              placeholder="e.g. mountain lion, puma, catamount"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] focus:ring-1 focus:ring-[#2d5a27] outline-none transition-all text-sm bg-[#fafaf5]/50"
            />
          </div>
          <p className="text-[10px] text-[#1a1c19]/40 mt-1.5 px-1">
            Add alternative names or common groupings separated by commas so users can easily find this animal on search.
          </p>
        </div>

        {/* Live check results display */}
        <AnimatePresence mode="wait">
          {nameCheckResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4"
            >
              {nameCheckResult.exists ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-900">
                  <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0">cancel</span>
                  <div className="text-xs leading-relaxed">
                    <strong>Already Exists!</strong> &ldquo;{nameCheckResult.animal?.animal_name}&rdquo; is already in our database. You can search for it on the site.
                  </div>
                </div>
              ) : nameCheckResult.isUnderReview ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900">
                  <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0">hourglass_top</span>
                  <div className="text-xs leading-relaxed">
                    <strong>Active Request Found!</strong> Someone has already requested &ldquo;{nameCheckResult.request?.animal_name}&rdquo;. It is currently in <strong>{nameCheckResult.request?.status}</strong> state.
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3 text-green-900">
                  <span className="material-symbols-outlined text-green-600 text-[20px] shrink-0">check_circle</span>
                  <div className="text-xs leading-relaxed">
                    <strong>Unique Choice!</strong> This animal is not in our database yet. Fill out the rest and request away!
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
