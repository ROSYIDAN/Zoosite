import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col md:flex-row justify-between items-center gap-6 bg-[#f4f4ef] py-12 px-8 font-body text-sm tracking-wide">
      <div className="flex flex-col gap-2 text-left">
        <span className="text-lg font-bold text-primary">
          The Digital Conservatory
        </span>
        <p className="text-stone-500">
          © 2024 The Digital Conservatory. All rights reserved.
        </p>
      </div>
      <nav className="flex gap-8">
        <Link
          href="#"
          className="text-stone-500 hover:text-primary-container transition-colors"
        >
          Login
        </Link>
        <Link
          href="#"
          className="text-stone-500 hover:text-primary-container transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          href="#"
          className="text-stone-500 hover:text-primary-container transition-colors"
        >
          Terms of Service
        </Link>
        <Link
          href="#"
          className="text-stone-500 hover:text-primary-container transition-colors"
        >
          Contact
        </Link>
      </nav>
    </footer>
  );
}
