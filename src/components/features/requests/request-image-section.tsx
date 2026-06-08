import { ChangeEvent } from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { RequestAnimalInput } from "@/lib/validations/animal-request.schema";

interface RequestImageSectionProps {
  imageUrl: string | null;
  isUploading: boolean;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  register: UseFormRegister<RequestAnimalInput>;
  setValue: UseFormSetValue<RequestAnimalInput>;
  watch: UseFormWatch<RequestAnimalInput>;
}

export default function RequestImageSection({
  imageUrl,
  isUploading,
  onUpload,
  onClear,
  register,
  setValue,
  watch,
}: RequestImageSectionProps) {
  const isAiGenerated = watch("image_source") === "AI Generated";

  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm flex flex-col min-h-[220px] font-['Manrope']">
      <h2 className="flex items-center gap-2 text-md font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] uppercase tracking-wider mb-6 pb-2 border-b border-[#e3e3de]">
        <span className="material-symbols-outlined text-[20px] text-[#2d5a27]">add_a_photo</span>
        Image Reference
      </h2>

      <div className="flex-1 flex flex-col justify-center">
        {imageUrl ? (
          <div className="relative rounded-xl overflow-hidden group border border-[#c2c9bb]">
            <img src={imageUrl} alt="Uploaded preview" className="w-full h-36 object-cover" />
            <button
              type="button"
              onClick={onClear}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#c2c9bb] rounded-xl p-6 bg-[#fafaf5] text-center flex flex-col items-center justify-center hover:bg-[#fafaf5]/80 transition-colors">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[#2d5a27] text-[32px]">progress_activity</span>
                <p className="text-[10px] text-[#72796e] font-bold uppercase tracking-widest">Uploading...</p>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-[#e3e3de] flex items-center justify-center group-hover:bg-[#2d5a27]/10 transition-colors">
                  <span className="material-symbols-outlined text-[#2d5a27]">add_photo_alternate</span>
                </div>
                <span className="text-[10px] font-bold text-[#2d5a27] uppercase tracking-wider">Upload Reference Image</span>
                <span className="text-[10px] text-[#72796e]">PNG, JPG, or JPEG</span>
                <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
              </label>
            )}
          </div>
        )}
      </div>

      {/* Attribution / Source Input */}
      <div className="mt-5 space-y-3 border-t border-[#e3e3de]/60 pt-4">
        <div>
          <label className="block text-xs font-bold text-[#1a1c19]/50 uppercase tracking-wider mb-2">
            Image Source / Attribution
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#1a1c19]/30">
              link
            </span>
            <input
              type="text"
              {...register("image_source")}
              placeholder="e.g. Wikimedia Commons, Unsplash, Self-shot"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] focus:ring-1 focus:ring-[#2d5a27] outline-none transition-all text-sm bg-[#fafaf5]/50"
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isAiGenerated}
            onChange={(e) => {
              if (e.target.checked) {
                setValue("image_source", "AI Generated");
              } else {
                if (watch("image_source") === "AI Generated") {
                  setValue("image_source", "");
                }
              }
            }}
            className="w-4 h-4 rounded border-[#c2c9bb] text-[#2d5a27] focus:ring-[#2d5a27]/30 cursor-pointer"
          />
          <span className="text-xs text-[#1a1c19]/70 font-semibold font-['Manrope']">
            This image is AI-generated
          </span>
        </label>
      </div>

      <div className="mt-4 flex items-start gap-2 bg-[#2d5a27]/5 border border-[#2d5a27]/10 rounded-xl p-3 text-[11px] text-[#41493d] select-none leading-relaxed">
        <span className="material-symbols-outlined text-[16px] text-[#2d5a27] shrink-0 mt-0.5">info</span>
        <div>
          <strong className="text-[#2d5a27] block mb-0.5 font-['Plus_Jakarta_Sans'] font-bold uppercase tracking-wider text-[9px]">Image Guidelines</strong>
          Please use copyright-free or public domain images (e.g., from Wikimedia Commons, Unsplash, or Pixabay). If no free image is available, you may use an <strong>AI-generated image</strong> <br />  instead — just check the &quot;This image is AI-generated&quot; box above so we can label it properly.
        </div>
      </div>
    </section>
  );
}
