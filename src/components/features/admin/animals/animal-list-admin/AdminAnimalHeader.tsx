import Link from "next/link";

/**
 * AdminAnimalHeader - Renders the dashboard title and Registration CTA button.
 */
export default function AdminAnimalHeader() {
  return (
    <header className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold tracking-tight text-primary">
          Species Inventory
        </h1>
      </div>

      <Link
        href="/admin/animals/create"
        className="flex items-center gap-2 px-6 py-3 bg-primary-container text-white rounded-2xl font-bold font-['Manrope'] shadow-lg shadow-primary-container/20 hover:bg-primary transition-all"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        Register Species
      </Link>
    </header>
  );
}
