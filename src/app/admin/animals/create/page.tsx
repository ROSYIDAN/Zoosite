import { dashboardRepo } from "@/repositories/dashboard.repo";
import AnimalForm from "@/components/features/admin/animals/AnimalForm";
import Link from "next/link";

export default async function CreateAnimalPage() {
  const classes = await dashboardRepo.getAnimalClasses();

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/animals" 
          className="p-2 rounded-xl bg-white border border-[#c2c9bb] text-[#42493e] hover:bg-[#f4f4ef] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] tracking-tight">
            Register New Animal
          </h1>
          <p className="text-sm text-[#42493e] mt-1 font-['Manrope']">
            Add a new species to the Arboreal Archive database.
          </p>
        </div>
      </div>

      <AnimalForm classes={classes} />
    </div>
  );
}
