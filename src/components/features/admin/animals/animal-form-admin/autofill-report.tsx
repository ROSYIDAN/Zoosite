"use client";

import { motion, AnimatePresence } from "framer-motion";

export interface AutofillStats {
  success: boolean;
  fieldsFilled: number;
  unresolvedClass?: string;
  resolvedClass?: string;
  matchedCountries: string[];
  unmatchedCountries: string[];
}

interface AutofillReportProps {
  showStats: AutofillStats | null;
  isUserRequest?: boolean;
}

export default function AutofillReport({ showStats, isUserRequest = false }: AutofillReportProps) {
  return (
    <div className="lg:col-span-2 bg-[#f4f4ef] border border-[#e3e3de] rounded-xl p-4 flex flex-col justify-between text-xs text-[#72796e] leading-relaxed">
      <AnimatePresence mode="wait">
        {showStats ? (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-[#e3e3de] pb-2">
              <span className="material-symbols-outlined text-[16px] text-[#2d5a27]">
                analytics
              </span>
              <span className="font-bold text-[#1a1c19] uppercase tracking-wider font-['Plus_Jakarta_Sans'] text-[10px]">
                Auto-Fill Report
              </span>
            </div>

            <div className="space-y-2 font-['Manrope']">
              <div className="flex justify-between items-center bg-white/60 p-2 rounded-lg border border-[#e3e3de]">
                <span className="font-semibold text-[#1a1c19]/70">Attributes Set:</span>
                <span className="font-bold text-[#2d5a27]">{showStats.fieldsFilled}</span>
              </div>

              {showStats.resolvedClass && (
                <div className="flex justify-between items-center bg-emerald-50/40 p-2 rounded-lg border border-emerald-100">
                  <span className="font-semibold text-emerald-950">Resolved Class:</span>
                  <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">
                    {showStats.resolvedClass}
                  </span>
                </div>
              )}

              {showStats.unresolvedClass && (
                <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200 flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-amber-900 font-bold">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Class Match Failed
                  </div>
                  <p className="text-[10px] text-amber-800/80 leading-normal">
                    AI output class "{showStats.unresolvedClass}" couldn't be matched automatically. Please select it manually.
                  </p>
                </div>
              )}

              {!isUserRequest && showStats.matchedCountries.length > 0 && (
                <div className="bg-white/60 p-2 rounded-lg border border-[#e3e3de] space-y-1">
                  <span className="font-semibold text-[#1a1c19]/70 block">
                    Matched Countries ({showStats.matchedCountries.length}):
                  </span>
                  <p className="text-[10px] text-[#2d5a27] font-semibold leading-normal">
                    {showStats.matchedCountries.join(", ")}
                  </p>
                </div>
              )}

              {!isUserRequest && showStats.unmatchedCountries.length > 0 && (
                <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block">
                    Unmatched Countries ({showStats.unmatchedCountries.length}):
                  </span>
                  <p className="text-[10px] text-amber-800/80 leading-normal">
                    {showStats.unmatchedCountries.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 border-b border-[#e3e3de] pb-2">
              <span className="material-symbols-outlined text-[16px] text-[#2d5a27]">info</span>
              <span className="font-bold text-[#1a1c19] uppercase tracking-wider font-['Plus_Jakarta_Sans'] text-[10px]">
                How to use AI Auto-Fill
              </span>
            </div>
            <ol className="list-decimal list-inside space-y-2 leading-relaxed text-[#72796e] pl-1 font-['Manrope']">
              <li>
                Click <strong className="text-[#2d5a27]">Download AI Template</strong> above to get the prompt file.
              </li>
              <li>
                Paste the template text into an AI assistant like **Gemini** or **ChatGPT**.
              </li>
              <li>
                Supply the target animal name and instruct it to generate the structured data.
              </li>
              <li>
                Copy the JSON output from the AI and drop or paste it in the assistant block.
              </li>
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 pt-3 border-t border-[#e3e3de] flex items-center gap-1.5 justify-center text-[10px] text-[#72796e]/70 font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
        <span className="material-symbols-outlined text-[12px] text-emerald-500">lock</span>
        Processed 100% Client-Side
      </div>
    </div>
  );
}