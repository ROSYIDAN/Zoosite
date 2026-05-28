import Link from "next/link";
import { auth } from "@/auth";
import UserMenu from "@/components/features/auth/user-menu";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 mx-auto bg-[#fafaf5] font-headline tracking-tight">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
          The Conservatory
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            href="#"
            className="text-stone-600 font-medium hover:text-primary transition-colors duration-300"
          >
            Exhibits
          </Link>
          <Link
            href="#"
            className="text-stone-600 font-medium hover:text-primary transition-colors duration-300"
          >
            Conservation
          </Link>
          <Link
            href="#"
            className="text-stone-600 font-medium hover:text-primary transition-colors duration-300"
          >
            Visit
          </Link>
          <Link
            href="#"
            className="text-stone-600 font-medium hover:text-primary transition-colors duration-300"
          >
            Research
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {session?.user ? (
          <UserMenu session={session} />
        ) : (
          <>
            <Link
              href="/login"
              className="material-symbols-outlined p-2 text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Sign in"
            >
              account_circle
            </Link>
            <Link
              href="/login"
              className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold hover:bg-primary-container transition-all active:scale-[0.99]"
            >
              Join Us
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
