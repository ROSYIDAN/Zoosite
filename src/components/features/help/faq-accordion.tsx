"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

export default function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>("unlock");

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const faqs: FAQItem[] = [
    {
      id: "unlock",
      question: "How do I unlock Mystery Submissions?",
      answer: (
        <p className="text-sm text-on-surface-variant leading-relaxed">
          To unlock the contribution portal, you must prove your zoological knowledge! You need to successfully complete the Easy, Normal, and Hard quizzes in the{" "}
          <Link href="/quiz" className="text-primary font-bold hover:underline inline-flex items-center gap-0.5">
            Quiz Arena
            <span className="material-symbols-outlined text-xs">arrow_outward</span>
          </Link>
          . Once you pass all three milestones, the locks on "Mystery Submission" and "Mystery History" will lift automatically, enabling you to suggest new species.
        </p>
      ),
    },
    {
      id: "strikes",
      question: "What are the rules and the contribution \"Strike\" system?",
      answer: (
        <div className="text-sm text-on-surface-variant leading-relaxed space-y-2">
          <p>
            To keep the database accurate and family-friendly, all submissions undergo a moderator review queue. If an administrator rejects your request:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>It accumulates as an active <strong>rejection strike</strong>.</li>
            <li>Users are limited to a maximum of <strong>3 active strikes</strong> before their request privilege is suspended.</li>
            <li>Administrators can reset user strike counts or lift bans manually. When an admin unbans a user, active strikes are automatically reset to <code className="bg-stone-200 dark:bg-stone-800 px-1 rounded">0 / 3</code>.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "sources",
      question: "Where does the wildlife catalog data come from?",
      answer: (
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Arboreal Archive sources its biological specifications, classifications, and text summaries from{" "}
          <Link href="https://wikipedia.org" target="_blank" className="text-primary font-semibold hover:underline">
            Wikipedia
          </Link>{" "}
          under Creative Commons. Photos are sourced from{" "}
          <Link href="https://commons.wikimedia.org" target="_blank" className="text-primary font-semibold hover:underline">
            Wikimedia Commons
          </Link>{" "}
          or other public-domain databases. Clickable photographer attributions are provided on each animal's detail page.
        </p>
      ),
    },
    {
      id: "search",
      question: "How do I search or explore the species archive?",
      answer: (
        <p className="text-sm text-on-surface-variant leading-relaxed">
          You can utilize the main search bar on the dashboard to locate animals by common or scientific names. Alternatively, you can browse by{" "}
          <Link href="/habitats" className="text-primary font-semibold hover:underline">
            Habitats
          </Link>{" "}
          (such as forests or waters) or explore geographical distribution via our{" "}
          <Link href="/regions" className="text-primary font-semibold hover:underline">
            Regions
          </Link>{" "}
          atlas.
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#154212] dark:text-[#d0e8c5] flex items-center gap-2 mb-2 font-headline">
        <span className="material-symbols-outlined">help_center</span>
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={cn(
                "border rounded-2xl transition-all duration-300 overflow-hidden",
                isOpen
                  ? "bg-[#fafaf5] dark:bg-[#232621]/40 border-[#c2c9bb] dark:border-[#2d5a27]/30 shadow-md"
                  : "bg-surface-container-low border-[#1a1c19]/5 dark:border-white/5 hover:border-[#c2c9bb]/50 dark:hover:border-white/10"
              )}
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-['Plus_Jakarta_Sans'] font-bold text-on-surface hover:text-[#154212] dark:hover:text-[#d0e8c5] transition-colors focus:outline-none"
              >
                <span>{faq.question}</span>
                <span
                  className={cn(
                    "material-symbols-outlined transition-transform duration-300 text-on-surface-variant",
                    isOpen && "rotate-180 text-primary"
                  )}
                >
                  keyboard_arrow_down
                </span>
              </button>
              <div
                className={cn(
                  "px-6 transition-all duration-300 ease-in-out overflow-hidden",
                  isOpen ? "max-h-60 pb-5 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="pt-1">{faq.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
