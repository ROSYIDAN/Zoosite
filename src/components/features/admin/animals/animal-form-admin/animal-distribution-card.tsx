"use client";

import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
// Component sub-sections
import CountrySection from "@/components/features/admin/animals/animal-form-admin/country-section";
import HabitatSection from "@/components/features/admin/animals/animal-form-admin/habitat-section";
import { Country } from "@/hooks/use-country-selection";

interface AnimalDistributionCardProps {
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
  initialCountries?: Country[];
  commonName?: string;
}

export default function AnimalDistributionCard({ setValue, watch, initialCountries, commonName }: AnimalDistributionCardProps) {
  return (
    <section className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-8">
      {/* Countries Section */}
      <CountrySection
        setValue={setValue}
        watch={watch}
        initialCountries={initialCountries}
        commonName={commonName}
      />

      <hr className="border-outline-variant/30" />

      {/* Habitats Section */}
      <HabitatSection
        setValue={setValue}
        watch={watch}
      />
    </section>
  );
}
