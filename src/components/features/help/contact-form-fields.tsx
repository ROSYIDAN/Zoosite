"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { type SupportInput, supportSubjectEnum } from "@/lib/validations/support.schema";

interface ContactFormFieldsProps {
  onSubmit: (e: React.FormEvent) => void;
  submitError: string | null;
}

export function ContactFormFields({ onSubmit, submitError }: ContactFormFieldsProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<SupportInput>();

  return (
    <div className="bg-surface-container-low border border-[#1a1c19]/5 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#154212] dark:text-[#d0e8c5] flex items-center gap-2 font-headline">
          <span className="material-symbols-outlined">mail</span>
          Send Us a Message
        </h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Have an inquiry, feedback, or a bug report? Drop us a line below.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {submitError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {submitError}
          </div>
        )}

        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
            Your Name
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              person
            </span>
            <input
              type="text"
              placeholder="e.g. John Doe"
              {...register("name")}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm bg-[#fafaf5]/50 dark:bg-zinc-800/40",
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-[#1a1c19]/10 dark:border-white/10 focus:border-[#2d5a27] focus:ring-1 focus:ring-[#2d5a27]"
              )}
            />
          </div>
          {errors.name && (
            <p className="text-[10px] text-red-500 font-semibold">{errors.name.message}</p>
          )}
        </div>

        {/* Email input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
            Email Address
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              mail
            </span>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              {...register("email")}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm bg-[#fafaf5]/50 dark:bg-zinc-800/40",
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-[#1a1c19]/10 dark:border-white/10 focus:border-[#2d5a27] focus:ring-1 focus:ring-[#2d5a27]"
              )}
            />
          </div>
          {errors.email && (
            <p className="text-[10px] text-red-500 font-semibold">{errors.email.message}</p>
          )}
        </div>

        {/* Subject input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
            Subject Category
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
              label
            </span>
            <select
              {...register("subject")}
              className={cn(
                "w-full pl-10 pr-10 py-2.5 rounded-xl border outline-none transition-all text-sm bg-[#fafaf5]/50 dark:bg-zinc-800/40 appearance-none cursor-pointer",
                errors.subject
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-[#1a1c19]/10 dark:border-white/10 focus:border-[#2d5a27] focus:ring-1 focus:ring-[#2d5a27]"
              )}
            >
              {supportSubjectEnum.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
              arrow_drop_down
            </span>
          </div>
          {errors.subject && (
            <p className="text-[10px] text-red-500 font-semibold">{errors.subject.message}</p>
          )}
        </div>

        {/* Message input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
            Message
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[20px]">
              chat
            </span>
            <textarea
              rows={5}
              placeholder="What can we help you with?"
              {...register("message")}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm bg-[#fafaf5]/50 dark:bg-zinc-800/40 resize-none",
                errors.message
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-[#1a1c19]/10 dark:border-white/10 focus:border-[#2d5a27] focus:ring-1 focus:ring-[#2d5a27]"
              )}
            />
          </div>
          {errors.message && (
            <p className="text-[10px] text-red-500 font-semibold">{errors.message.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2d5a27] hover:bg-[#2d5a27]/90 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg focus:ring-2 focus:ring-[#2d5a27]/30"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending Message...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">send</span>
              Submit Ticket
            </>
          )}
        </button>
      </form>
    </div>
  );
}
