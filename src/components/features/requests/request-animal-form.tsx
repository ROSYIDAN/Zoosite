"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRequestAnimalForm } from "@/hooks/use-request-animal-form";
import { cn } from "@/lib/utils";

import RequestStrikeWarning from "./request-strike-warning";
import RequestIdentitySection from "./request-identity-section";
import RequestImageSection from "./request-image-section";
import RequestClassificationSection from "./request-classification-section";
import RequestDescriptionSection from "./request-description-section";
import RequestStatsSection from "./request-stats-section";
import { GuidelinesModal } from "./guidelines-modal";
import AnimalAiAutofill from "../admin/animals/animal-form-admin/animal-ai-autofill";

interface RequestAnimalFormProps {
  classes: { id: string; name: string }[];
  initialRejectionCount?: number;
  isBanned?: boolean;
}

export default function RequestAnimalForm({ classes, initialRejectionCount = 0, isBanned = false }: RequestAnimalFormProps) {
  const router = useRouter();
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(false);

  useEffect(() => {
    const alreadyRead = localStorage.getItem("zoosite_guidelines_read") === "true";
    if (!alreadyRead) {
      setIsGuidelinesOpen(true);
    }
  }, []);

  // Extract all states, validations, debouncing, and uploader logic from custom hook
  const {
    register,
    handleSubmit,
    setValue,
    errors,
    activeTab,
    setActiveTab,
    isUploading,
    isChecking,
    isSubmitting,
    nameCheckResult,
    imageUrl,
    handleImageUpload,
    handleClearImage,
    onSubmit,
    isUnchanged,
    watch,
  } = useRequestAnimalForm();

  if (isBanned) {
    return (
      <div className="w-full mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-sm my-10">
        <span className="material-symbols-outlined text-[64px] text-red-500 mb-4">gavel</span>
        <h2 className="text-xl font-bold text-red-950 font-['Plus_Jakarta_Sans'] mb-2">Request Privileges Suspended</h2>
        <p className="text-sm text-red-800/80 font-['Manrope'] max-w-[500px] mx-auto leading-relaxed">
          Your ability to submit new animal requests has been suspended by an administrator due to multiple rejected submissions or trolling. If you believe this is a mistake, please reach out to our support team.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-20 font-['Manrope']">
      {/* Guidelines Modal Component */}
      <GuidelinesModal isOpen={isGuidelinesOpen} onOpenChange={setIsGuidelinesOpen} />

      {/* ⚠️ Strike Warning Sub-component */}
      <RequestStrikeWarning rejectionCount={initialRejectionCount} />

      {/* 💡 Guidelines Trigger Button */}
      <div className="flex justify-center mb-8">
        <button
          type="button"
          onClick={() => setIsGuidelinesOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2d5a27]/10 text-[#2d5a27] hover:bg-[#2d5a27]/20 transition-all font-semibold font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-wider shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">gavel</span>
          View Contribution Guidelines
        </button>
      </div>

      {/* AI Auto-Fill Assistant */}
      <div className="max-w-[800px] mx-auto">
        <AnimalAiAutofill
          classes={classes}
          setValue={setValue}
          isUserRequest={true}
          onSuccess={() => setActiveTab("FULL_DETAIL")}
        />
      </div>

      {/* Tabs */}
      <div className="flex bg-[#e3e3de] p-1.5 rounded-2xl max-w-[400px] mx-auto mb-8 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("QUICK")}
          className={cn(
            "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all font-['Plus_Jakarta_Sans'] uppercase tracking-wider",
            activeTab === "QUICK" ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e] hover:text-[#1a1c19]"
          )}
        >
          Quick Request
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("FULL_DETAIL")}
          className={cn(
            "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all font-['Plus_Jakarta_Sans'] uppercase tracking-wider",
            activeTab === "FULL_DETAIL" ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e] hover:text-[#1a1c19]"
          )}
        >
          Full Details Request
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Core details Section (Common Name + live check & Media Upload) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RequestIdentitySection
            register={register}
            errors={errors}
            isChecking={isChecking}
            nameCheckResult={nameCheckResult}
          />
          <RequestImageSection
            imageUrl={imageUrl || null}
            isUploading={isUploading}
            onUpload={handleImageUpload}
            onClear={handleClearImage}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </div>

        {/* ── Dynamic Full details fields ── */}
        <AnimatePresence mode="wait">
          {activeTab === "FULL_DETAIL" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <RequestClassificationSection register={register} errors={errors} classes={classes} />
              <RequestDescriptionSection register={register} />
              <RequestStatsSection register={register} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-[#1a1c19]/10 text-sm font-bold text-[#1a1c19]/60 hover:bg-[#1a1c19]/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading || isChecking || nameCheckResult?.exists || nameCheckResult?.isUnderReview}
            className={cn(
              "flex items-center gap-2 px-8 py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition-all font-['Plus_Jakarta_Sans'] uppercase tracking-wider",
              (isSubmitting || isUploading || isChecking || nameCheckResult?.exists || nameCheckResult?.isUnderReview)
                ? "bg-[#2d5a27] opacity-50 cursor-not-allowed"
                : isUnchanged
                  ? "bg-[#2d5a27]/60 cursor-not-allowed opacity-75 hover:bg-[#2d5a27]/60"
                  : "bg-[#2d5a27] hover:bg-[#1f3f1b] cursor-pointer"
            )}
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Submitting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">send</span>
                Submit Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
