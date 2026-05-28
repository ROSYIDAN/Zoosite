"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className={className}>
      {children}
    </button>
  );
}
