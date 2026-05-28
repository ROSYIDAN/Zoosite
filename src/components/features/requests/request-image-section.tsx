import { ChangeEvent } from "react";

interface RequestImageSectionProps {
  imageUrl: string | null;
  isUploading: boolean;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export default function RequestImageSection({ imageUrl, isUploading, onUpload, onClear }: RequestImageSectionProps) {
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
    </section>
  );
}
