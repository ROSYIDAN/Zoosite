import { redirect } from "next/navigation";
import { auth } from "@/auth";
import GoogleSignInButton from "@/components/features/auth/google-sign-in-button";
import { signInWithPasscode } from "@/lib/auth-actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await auth();

  if (session?.user) {
    if (session.user.role === "ADMIN") {
      redirect("/admin");
    }
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#fafaf5] px-6 py-16 text-[#1a1c19]">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
              ZooSite Access
            </p>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
              Sign in to The Conservatory
            </h1>
            <p className="text-base leading-7 text-stone-600">
              Use your Google account to save progress and access protected curator tools.
            </p>
          </div>

          {error === "AccessDenied" && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2 font-medium">
                <svg className="h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Sign-in request was cancelled or access was denied.</span>
              </div>
            </div>
          )}

          <GoogleSignInButton />

          <div className="pt-8 border-t border-stone-200">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
                Developer Access
              </p>

              {error === "CredentialsSignin" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center gap-2 font-medium">
                    <svg className="h-4 w-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Invalid developer passcode. Please try again.</span>
                  </div>
                </div>
              )}

              <form action={signInWithPasscode} className="flex gap-2">
                <input
                  type="text"
                  name="passcode"
                  placeholder="Enter dev secret..."
                  className="flex-1 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm focus:border-primary-container focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-stone-900"
                >
                  Bypass
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
