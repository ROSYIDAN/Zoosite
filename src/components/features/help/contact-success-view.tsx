"use client";

import React from "react";

interface ContactSuccessViewProps {
  onReset: () => void;
}

export function ContactSuccessView({ onReset }: ContactSuccessViewProps) {
  return (
    <div className="bg-[#fafaf5] dark:bg-[#1a1c19]/80 border border-[#c2c9bb] dark:border-white/10 rounded-3xl p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
      <div className="w-16 h-16 bg-[#2d5a27]/10 dark:bg-[#d0e8c5]/10 text-primary dark:text-[#d0e8c5] rounded-full flex items-center justify-center mb-6 shadow-inner">
        <span className="material-symbols-outlined text-4xl">mark_email_read</span>
      </div>
      <h3 className="text-2xl font-bold text-[#154212] dark:text-[#d0e8c5] mb-3 font-headline">
        Message Sent!
      </h3>
      <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed mb-8">
        Thank you for reaching out to the Digital Conservatory. A simulated support ticket has been registered, and our administrators have been notified!
      </p>
      <button
        onClick={onReset}
        className="bg-[#2d5a27] hover:bg-[#2d5a27]/90 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#2d5a27]/30"
      >
        Send Another Message
      </button>
    </div>
  );
}
