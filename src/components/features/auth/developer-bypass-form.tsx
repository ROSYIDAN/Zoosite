"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DeveloperBypassForm() {
  const [passcode, setPasscode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    setIsSubmitting(true);

    try {
      const res = await signIn("developer-bypass", {
        passcode,
        redirect: false,
      });

      if (res?.error) {
        router.push("/login?error=CredentialsSignin");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      router.push("/login?error=CredentialsSignin");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        name="passcode"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        disabled={isSubmitting}
        placeholder="Enter dev secret..."
        className="flex-1 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm focus:border-primary-container focus:outline-none"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-stone-900 disabled:opacity-50"
      >
        {isSubmitting ? "Bypassing..." : "Bypass"}
      </button>
    </form>
  );
}
