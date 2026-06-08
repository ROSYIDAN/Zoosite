import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { animalRequestRepo } from "@/repositories/animal-request.repo";
import ReviewFormWrapper from "./ReviewFormWrapper";
import type { CreateAnimalInput } from "@/lib/validations/animal.schema";

export default async function RequestReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Session auth guard
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
    redirect("/forbidden");
  }

  const { id } = await params;

  // 2. Fetch target animal request details
  const request = await animalRequestRepo.findById(id);
  if (!request) {
    notFound();
  }

  // 3. Fetch animal classes for the classification select dropdown
  const classes = await prisma.animal_class.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  // 4. Fetch the initial country details to populate country badges in UI
  const initialCountries = await prisma.countries.findMany({
    where: { id: { in: request.countries || [] } },
    select: { id: true, country: true, country_flag: true },
  });

  // 5. Map request data fields dynamically into standard CreateAnimalInput shape
  const initialData: CreateAnimalInput = {
    name: request.animal_name,
    scientific_name: request.scientific_name || "",
    synonyms: request.synonyms || "",
    family: request.family || "",
    genus: request.genus || "",
    ordo: request.ordo || "",
    class_id: request.class_id || "",
    description: request.description || "",
    description_source: request.description_source || "",
    diet: request.diet || "Herbivore",
    lifespan_years: request.lifespan_years || "",
    weight_kg: request.weight_kg || "",
    height_cm: request.height_cm || "",
    avg_speed_kmh: request.avg_speed_kmh || "",
    top_speed_kmh: request.top_speed_kmh || "",
    social_structure: request.social_structure || "",
    conservation_status: request.conservation_status || "Least Concern",
    predators: request.predators || "",
    image: request.image_url || "",
    image_source: request.image_source || "Community Request",
    tags: request.tags || [],
    countries: request.countries || [],
    habitats: request.habitats || [],
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary px-3 py-1 rounded-full font-['Plus_Jakarta_Sans']">
            Reviewing &ldquo;{request.request_type}&rdquo; Request
          </span>
          <h1 className="text-3xl font-bold text-primary font-['Plus_Jakarta_Sans'] mt-2">
            Review Species Request: {request.animal_name}
          </h1>
          <p className="text-sm text-[#1a1c19]/60 font-['Manrope'] mt-1">
            Review community suggested content, complete missing descriptors (if Quick Request), and create database profile.
          </p>
        </div>
      </header>

      <ReviewFormWrapper
        requestId={id}
        classes={classes}
        initialData={initialData}
        initialCountries={initialCountries}
      />
    </div>
  );
}
