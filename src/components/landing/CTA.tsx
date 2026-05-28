import Link from "next/link";
import { auth } from "@/auth";

export default async function CTA() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const dashboardHref = session?.user?.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <section className="py-32">
      <div className="container mx-auto px-8">
        <div className="hero-gradient rounded-[3rem] p-16 md:p-24 text-center text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter mb-8 leading-tight">
              Access the Full Archive.
            </h2>
            <p className="text-xl text-surface-container-lowest/80 mb-12 max-w-2xl mx-auto font-medium">
              Join our community of conservationists and gain exclusive access
              to research journals, premium animal cameras, and early visit
              bookings.
            </p>
            {isLoggedIn ? (
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-4 bg-surface-container-lowest text-primary px-12 py-5 rounded-full font-extrabold text-lg hover:bg-surface transition-all transform hover:-translate-y-1 shadow-xl"
              >
                View Dashboard
                <span className="material-symbols-outlined">space_dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-4 bg-surface-container-lowest text-primary px-12 py-5 rounded-full font-extrabold text-lg hover:bg-surface transition-all transform hover:-translate-y-1 shadow-xl"
              >
                Log In to Portfolio
                <span className="material-symbols-outlined">login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
