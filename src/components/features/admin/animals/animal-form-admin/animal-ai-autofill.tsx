"use client";

import { useAnimalAiAutofill } from "@/hooks/use-animal-ai-autofill";
import DragDropZone from "./drag-drop-zone";
import AutofillReport from "./autofill-report";

interface AiAutofillProps {
  classes: { id: string; name: string }[];
  initialCountries?: { id: string; country: string; country_flag: string | null }[];
  setValue: (field: any, value: any, options?: any) => void;
  isUserRequest?: boolean;
  onSuccess?: () => void;
}

export default function AnimalAiAutofill({
  classes,
  initialCountries,
  setValue,
  isUserRequest = false,
  onSuccess,
}: AiAutofillProps) {
  const {
    isDragOver,
    pastedText,
    isProcessing,
    showStats,
    fileInputRef,
    handleDownloadTemplate,
    handlePasteChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
  } = useAnimalAiAutofill({
    classes,
    initialCountries,
    setValue,
    isUserRequest,
    onSuccess,
  });

  return (
    <div className="w-full bg-[#fafaf5] border border-[#c2c9bb] rounded-2xl p-6 shadow-sm font-['Manrope'] mb-8 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#e3e3de] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#2d5a27]/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#2d5a27] text-[28px] animate-pulse">
              robot_2
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] flex items-center gap-1.5 uppercase tracking-wider">
              AI Auto-Fill Assistant
              <span className="px-2 py-0.5 text-[9px] bg-[#2d5a27]/10 text-[#2d5a27] rounded-full font-bold font-sans tracking-normal lowercase">
                beta
              </span>
            </h3>
            <p className="text-xs text-[#72796e]">
              Instant animal data population using your favorite AI model.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2d5a27] hover:bg-[#1f3f1b] rounded-xl transition-all font-['Plus_Jakarta_Sans'] uppercase tracking-wider shadow-sm shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          Download AI Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Drag/Paste Area */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <label className="block text-xs font-bold text-[#1a1c19]/60 uppercase tracking-wider">
            Paste AI JSON Output or Drop File
          </label>
          <DragDropZone
            isDragOver={isDragOver}
            isProcessing={isProcessing}
            success={!!showStats?.success}
            fileInputRef={fileInputRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
            onClick={() => fileInputRef.current?.click()}
          />

          <textarea
            value={pastedText}
            onChange={handlePasteChange}
            placeholder='{ "name": "Red Panda", ... }'
            className="w-full px-4 py-3 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] outline-none text-xs bg-white font-mono min-h-[90px] shadow-inner resize-y transition-all"
          />
        </div>

        {/* Right Instructions / Report Panel */}
        <AutofillReport showStats={showStats} isUserRequest={isUserRequest} />
      </div>
    </div>
  );
}