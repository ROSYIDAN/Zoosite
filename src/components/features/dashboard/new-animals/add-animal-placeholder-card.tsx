"use client";

import { useQuizStore } from "@/store/quiz.store";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Placeholder card to prompt users/admins to contribute a new species.
 * Dynamically detects if the user is locked (has not completed hard quiz and is not an admin).
 * Keeps the dashboard grid perfectly balanced to a multiple of 3.
 */
export default function AddAnimalPlaceholderCard() {
  const { data: session } = useSession();
  const { completedLevels } = useQuizStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAdmin = session?.user?.role === UserRole.ADMIN;
  // Fallback to false if not mounted to prevent SSR hydration mismatches
  const isUnlocked = isAdmin || (isMounted && completedLevels.includes("hard"));

  if (!isUnlocked) {
    return (
      <Link href="/request-animal" className="block h-full">
        <div className="border-2 border-dashed border-outline-variant/30 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col items-center justify-center h-82 text-center group transition-colors cursor-pointer bg-surface-container-low/20 hover:bg-surface-container-low/50">
          <span
            className="material-symbols-outlined text-4xl text-on-surface-variant/40 group-hover:text-amber-500 group-hover:scale-110 transition-all mb-2"
            style={{ fontVariationSettings: "'wght' 300" }}
          >
            lock
          </span>
          <h3 className="font-bold text-sm text-on-surface-variant group-hover:text-amber-500 transition-colors font-headline">
            Mystery Submission 🔒
          </h3>
          <p className="text-[10px] text-on-surface-variant/60 mt-1 max-w-[180px] leading-normal font-medium">
            Prove your zoological mastery in the Quiz Arena to unlock suggestions!
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href="/request-animal" className="block h-full">
      <div className="border-2 border-dashed border-outline-variant/30 hover:border-primary/40 rounded-2xl p-4 flex flex-col items-center justify-center h-82 text-center group transition-colors cursor-pointer bg-surface-container-low/20 hover:bg-surface-container-low/50">
        <span
          className="material-symbols-outlined text-4xl text-on-surface-variant/40 group-hover:text-primary group-hover:scale-110 transition-all mb-2"
          style={{ fontVariationSettings: "'wght' 300" }}
        >
          add_circle
        </span>
        <h3 className="font-bold text-sm text-on-surface-variant group-hover:text-primary transition-colors font-headline">
          Submit New Animal
        </h3>
        <p className="text-[10px] text-on-surface-variant/60 mt-1 max-w-[180px] leading-normal font-medium">
          Help grow our wildlife catalog by contributing a missing species!
        </p>
      </div>
    </Link>
  );
}
