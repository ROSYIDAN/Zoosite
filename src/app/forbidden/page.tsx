import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafaf5] px-6 text-[#1a1c19]">
      <div className="max-w-md space-y-5 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2d5a27]">
          Access Restricted
        </p>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-[#154212]">
          Admin access is required
        </h1>
        <p className="text-stone-600">
          Your account is signed in, but it has not been promoted to an admin role.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex rounded-lg bg-[#154212] px-5 py-3 font-bold text-white transition-colors hover:bg-[#2d5a27]"
        >
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
