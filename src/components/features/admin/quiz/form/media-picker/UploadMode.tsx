"use client";

import { useState } from "react";

interface UploadModeProps {
  onSelect: (url: string, refId: string | null) => void;
}

export default function UploadMode({ onSelect }: UploadModeProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        onSelect(json.url, null);
      } else {
        const error = await res.json();
        console.error("Upload failed:", error);
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <span className="material-symbols-outlined animate-spin text-[#2d5a27] text-[32px]">
            progress_activity
          </span>
          <p className="text-[10px] text-[#72796e] font-bold uppercase tracking-widest">Uploading...</p>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-[#e3e3de] flex items-center justify-center group-hover:bg-[#2d5a27]/10 transition-colors">
            <span className="material-symbols-outlined text-[#2d5a27]">add_photo_alternate</span>
          </div>
          <div className="text-[10px] text-[#72796e]">
            <span className="font-bold text-[#2d5a27]">Click to upload</span> or drag and drop
            <br />
            PNG, JPG or JPEG
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
        </label>
      )}
    </div>
  );
}
