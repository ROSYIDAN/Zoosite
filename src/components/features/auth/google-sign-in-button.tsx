"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-white border border-stone-200 px-5 font-bold text-[#154212] shadow-sm transition-colors hover:bg-stone-50 active:scale-[0.99]"
    >
      <FcGoogle className="text-[20px]" />
      Continue with Google
    </button>
  );
}
