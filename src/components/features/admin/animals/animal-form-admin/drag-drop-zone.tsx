"use client";

import { RefObject } from "react";

interface DragDropZoneProps {
  isDragOver: boolean;
  isProcessing: boolean;
  success: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
}

export default function DragDropZone({
  isDragOver,
  isProcessing,
  success,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onClick,
}: DragDropZoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-all min-h-[140px] cursor-pointer ${
        isDragOver
          ? "border-[#2d5a27] bg-[#2d5a27]/5"
          : success
          ? "border-emerald-500 bg-emerald-50/10"
          : "border-[#1a1c19]/15 hover:border-[#2d5a27]/50 hover:bg-[#2d5a27]/2"
      }`}
      onClick={onClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept=".json,.txt"
        className="hidden"
      />
      {isProcessing ? (
        <div className="flex flex-col items-center gap-2">
          <span className="material-symbols-outlined animate-spin text-[32px] text-[#2d5a27]">
            progress_activity
          </span>
          <span className="text-xs font-bold text-[#2d5a27]">Analyzing JSON Data...</span>
        </div>
      ) : success ? (
        <div className="flex flex-col items-center text-center gap-1.5 p-2">
          <span className="material-symbols-outlined text-[36px] text-emerald-500">
            check_circle
          </span>
          <span className="text-xs font-bold text-emerald-950 font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
            Success! Auto-Fill Complete
          </span>
          <span className="text-[11px] text-emerald-800/80">
            Drag a new file or click here to overwrite existing fields.
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center gap-1.5 p-2 pointer-events-none">
          <span className="material-symbols-outlined text-[32px] text-[#72796e]">
            cloud_upload
          </span>
          <span className="text-xs font-bold text-[#1a1c19]/70 font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
            Drag & Drop prompt file or Click to Browse
          </span>
          <span className="text-[11px] text-[#72796e]">
            Or paste the raw JSON block directly below.
          </span>
        </div>
      )}
    </div>
  );
}