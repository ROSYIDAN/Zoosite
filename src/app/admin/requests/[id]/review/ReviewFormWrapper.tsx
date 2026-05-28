"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AnimalForm from "@/components/features/admin/animals/AnimalForm";
import type { CreateAnimalInput } from "@/lib/validations/animal.schema";

interface ReviewFormWrapperProps {
  requestId: string;
  classes: { id: string; name: string }[];
  initialData: CreateAnimalInput;
  initialCountries: { id: string; country: string; country_flag: string | null }[];
}

export default function ReviewFormWrapper({
  requestId,
  classes,
  initialData,
  initialCountries,
}: ReviewFormWrapperProps) {
  const router = useRouter();

  const handleSubmitReview = async (data: CreateAnimalInput) => {
    const toastId = toast.loading("Saving corrections and approving species profile...");
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE",
          approvedFields: {
            name: data.name,
            scientific_name: data.scientific_name,
            synonyms: data.synonyms,
            family: data.family,
            genus: data.genus,
            ordo: data.ordo,
            class_id: data.class_id,
            description: data.description,
            description_source: data.description_source,
            diet: data.diet,
            lifespan_years: data.lifespan_years,
            weight_kg: data.weight_kg,
            height_cm: data.height_cm,
            avg_speed_kmh: data.avg_speed_kmh,
            top_speed_kmh: data.top_speed_kmh,
            social_structure: data.social_structure,
            conservation_status: data.conservation_status,
            predators: data.predators,
            image: data.image,
            image_source: data.image_source || "Community Request",
            tags: data.tags,
            countries: data.countries,
            habitats: data.habitats,
          },
        }),
      });

      if (res.ok) {
        toast.success("Animal approved, corrections saved, and database profile created!", { id: toastId });
        router.push("/admin/requests");
        router.refresh();
      } else {
        const json = await res.json().catch(() => ({}));
        toast.error(json.message || "Failed to approve request.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.", { id: toastId });
    }
  };

  const handleCancelReview = async () => {
    const toastId = toast.loading("Cancelling review and releasing request lock...");
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UNLOCK" }),
      });

      if (res.ok) {
        toast.success("Request review cancelled.", { id: toastId });
      } else {
        toast.dismiss(toastId);
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
    }
    router.push("/admin/requests");
    router.refresh();
  };

  return (
    <AnimalForm
      classes={classes}
      initialData={initialData}
      initialCountries={initialCountries}
      onSubmitOverride={handleSubmitReview}
      onCancelOverride={handleCancelReview}
    />
  );
}
