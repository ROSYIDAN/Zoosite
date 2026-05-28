import { notFound } from "next/navigation";
import AnimalForm from "@/components/features/admin/animals/AnimalForm";
import { prisma } from "@/lib/prisma";
import { animalRepo } from "@/repositories/animal.repo";
import type { CreateAnimalInput } from "@/lib/validations/animal.schema";

export default async function EditAnimalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Fetch classes for the dropdown
  const classes = await prisma.animal_class.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  // 2. Fetch the animal to edit using the repository
  const animal = await animalRepo.findById(id);

  if (!animal) {
    notFound();
  }

  // 3. Map Prisma animal to CreateAnimalInput format
  const dataset = animal.dataset_animals[0];
  const initialData: CreateAnimalInput & { id: string } = {
    id: animal.id,
    name: animal.animal_name || "",
    scientific_name: animal.scientific_name || "",
    synonyms: animal.synonyms || "",
    family: animal.family || undefined,
    genus: animal.genus || undefined,
    ordo: animal.ordo || undefined,
    class_id: animal.class_id || undefined,
    description: animal.animal_descriptions[0]?.summary || undefined,
    description_source: animal.animal_descriptions[0]?.source_url || "",
    diet: dataset?.diet || "Herbivore",
    lifespan_years: dataset?.lifespan_years || "",
    weight_kg: dataset?.weight_kg || "",
    height_cm: dataset?.height_cm || "",
    avg_speed_kmh: dataset?.avg_speed_kmh || "",
    top_speed_kmh: dataset?.top_speed_kmh || "",
    social_structure: dataset?.social_structure || "",
    conservation_status: dataset?.conservation_status || "Least Concern",
    predators: dataset?.predators || "",
    image: animal.animal_images[0]?.image_url || undefined,
    image_source: animal.animal_images[0]?.source || undefined,
    tags: animal.tags.map((tag) => tag.name),
    countries: animal.animal_distributions.flatMap((d) => d.countries ? [d.countries.id] : []),
    habitats: animal.animal_environment.flatMap((e) => (e.habitat && e.habitat.habitat_name) ? [e.habitat.habitat_name] : []),
  };

  const initialCountries = animal.animal_distributions
    .filter((d) => d.countries !== null)
    .map((d) => ({
      id: d.countries!.id,
      country: d.countries!.country,
      country_flag: d.countries!.country_flag,
    }));

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-primary font-['Plus_Jakarta_Sans']">
          Edit Species: {initialData.name}
        </h1>
        <p className="text-sm text-[#1a1c19]/60 font-['Manrope'] mt-2">
          Update taxonomy, descriptive content, tags, and media.
        </p>
      </header>

      <AnimalForm classes={classes} initialData={initialData} initialCountries={initialCountries} />
    </div>
  );
}
