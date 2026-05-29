"use client";

import { useRouter } from "next/navigation";

interface AnimalFormActionsProps {
  isSubmitting: boolean;
  isDirty: boolean;
  isValid?: boolean;
  isEditing?: boolean;
  onCancel?: () => void | Promise<void>;
  onReject?: () => void | Promise<void>;
}

export default function AnimalFormActions({ isSubmitting, isDirty, isValid, isEditing, onCancel, onReject }: AnimalFormActionsProps) {
  const router = useRouter();

  return (
    <div className="sticky top-6 flex flex-col gap-3 mt-4">
      <button
        type="submit"
        disabled={isSubmitting || !isDirty || (isValid !== undefined && !isValid)}
        className={`w-full disabled:bg-[#c2c9bb] disabled:text-white py-3.5 rounded-2xl font-bold font-['Manrope'] shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
          isEditing
            ? "bg-yellow-500 hover:bg-yellow-600 text-[#1a1c19] shadow-yellow-500/20"
            : "bg-[#2d5a27] hover:bg-[#154212] text-white shadow-[#2d5a27]/10"
        }`}
      >
        {isSubmitting ? (
          <span className={`w-5 h-5 border-2 rounded-full animate-spin ${isEditing ? "border-black/30 border-t-black" : "border-white/30 border-t-white"}`} />
        ) : (
          <span className="material-symbols-outlined text-[20px]">save</span>
        )}
        {isEditing ? "Update Animal Profile" : "Save Animal Profile"}
      </button>
      
      <button
        type="button"
        onClick={onCancel || (() => router.back())}
        className="w-full bg-white border border-[#c2c9bb] text-[#42493e] py-3.5 rounded-2xl font-bold font-['Manrope'] hover:bg-[#f4f4ef] transition-all"
      >
        Cancel
      </button>

      {onReject && (
        <button
          type="button"
          onClick={onReject}
          className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 py-3.5 rounded-2xl font-bold font-['Manrope'] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[20px]">cancel</span>
          Reject Request
        </button>
      )}
    </div>
  );
}
