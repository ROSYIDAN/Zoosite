"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signInWithPasscode(formData: FormData) {
  const passcode = formData.get("passcode");
  try {
    await signIn("developer-bypass", { 
      passcode, 
      redirectTo: "/admin" 
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect("/login?error=CredentialsSignin");
    }
    throw error;
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
