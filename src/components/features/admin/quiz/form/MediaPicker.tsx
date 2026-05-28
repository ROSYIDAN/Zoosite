"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SelectedPreview from "./media-picker/SelectedPreview";
import SearchMode from "./media-picker/SearchMode";
import UploadMode from "./media-picker/UploadMode";

interface MediaPickerProps {
  onSelect: (url: string, referenceId: string | null) => void;
  initialValue?: string;
  initialReferenceId?: string | null;
  label?: string;
  compact?: boolean;
  allowUpload?: boolean;
  allowSearch?: boolean;
}

/**
 * MediaPicker component that allows selecting an image from existing animals
 * or uploading a new one.
 * Orchestrates sub-components for Preview, Search, and Upload.
 */
export default function MediaPicker({
  onSelect,
  initialValue,
  initialReferenceId,
  label,
  compact = false,
  allowUpload = true,
  allowSearch = true,
}: MediaPickerProps) {
  const [activeTab, setActiveTab] = useState<"search" | "upload">("search");
  const [selectedImage, setSelectedImage] = useState<string | null>(initialValue || null);
  const [selectedRefId, setSelectedRefId] = useState<string | null>(initialReferenceId || null);

  // Sync state with props when they change (critical for Edit mode)
  useEffect(() => {
    setSelectedImage(initialValue || null);
  }, [initialValue]);

  useEffect(() => {
    setSelectedRefId(initialReferenceId || null);
  }, [initialReferenceId]);

  // Force switch tabs if one is disabled
  useEffect(() => {
    if (!allowUpload && activeTab === "upload") {
      setActiveTab("search");
    } else if (!allowSearch && activeTab === "search" && allowUpload) {
      setActiveTab("upload");
    }
  }, [allowUpload, allowSearch, activeTab]);

  const handleSelect = (url: string, refId: string | null) => {
    setSelectedImage(url);
    setSelectedRefId(refId);
    onSelect(url, refId);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setSelectedRefId(null);
    onSelect("", null);
  };

  return (
    <div className={cn("space-y-3 flex flex-col flex-1", compact ? "scale-95 origin-top-left" : "")}>
      {label && (
        <label className="block text-xs font-semibold text-[#1a1c19] font-['Manrope'] mb-2 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Selected Preview */}
      {selectedImage ? (
        <div className="flex-1 flex flex-col justify-center">
          <SelectedPreview url={selectedImage} isLinked={!!selectedRefId} onClear={handleClear} />
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#c2c9bb] rounded-xl p-6 bg-[#fafaf5] text-center flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            {/* Tabs (Only show if both are allowed) */}
            {allowUpload && allowSearch && (
              <div className="flex bg-[#e3e3de] p-1 rounded-lg">
                <TabButton
                  active={activeTab === "search"}
                  onClick={() => setActiveTab("search")}
                  label="Search DB"
                />
                <TabButton
                  active={activeTab === "upload"}
                  onClick={() => setActiveTab("upload")}
                  label="Upload"
                />
              </div>
            )}

            {/* Tab Content */}
            {activeTab === "search" && <SearchMode onSelect={handleSelect} />}
            {activeTab === "upload" && <UploadMode onSelect={handleSelect} />}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Small internal component for tab buttons
 */
function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 text-xs font-semibold rounded-md transition-all",
        active ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e] hover:text-[#1a1c19]"
      )}
    >
      {label}
    </button>
  );
}
