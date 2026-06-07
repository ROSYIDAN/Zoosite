"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createAnimalSchema, type CreateAnimalInput } from "@/lib/validations/animal.schema";
import { useState } from "react";
import { toast } from "react-hot-toast";

import AnimalIdentityCard from "./animal-form-admin/animal-identity-card";
import AnimalDescriptionCard from "./animal-form-admin/animal-description-card";
import AnimalDetailStatsCard from "./animal-form-admin/animal-detail-stats-card";
import AnimalClassificationCard from "./animal-form-admin/animal-classification-card";
import AnimalMediaCard from "./animal-form-admin/animal-media-card";
import AnimalTagCard from "./animal-form-admin/animal-tag-card";
import AnimalDistributionCard from "./animal-form-admin/animal-distribution-card";
import AnimalFormActions from "./animal-form-admin/animal-form-actions";
import AnimalPreviewModal from "./animal-form-admin/AnimalPreviewModal";
import AnimalAiAutofill from "./animal-form-admin/animal-ai-autofill";

interface AnimalFormProps {
  classes: { id: string; name: string }[];
  initialData?: CreateAnimalInput & { id?: string };
  initialCountries?: { id: string; country: string; country_flag: string | null }[];
  onSubmitOverride?: (data: CreateAnimalInput) => Promise<void>;
  onCancelOverride?: () => void | Promise<void>;
  onRejectOverride?: () => void | Promise<void>;
}

export default function AnimalForm({ classes, initialData, initialCountries, onSubmitOverride, onCancelOverride, onRejectOverride }: AnimalFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isEditing = !!initialData?.id;
  const isReviewMode = !!onSubmitOverride;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateAnimalInput>({
    resolver: zodResolver(createAnimalSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      scientific_name: initialData?.scientific_name || "",
      family: initialData?.family || "",
      genus: initialData?.genus || "",
      ordo: initialData?.ordo || "",
      class_id: initialData?.class_id || "",
      description: initialData?.description || "",
      description_source: initialData?.description_source || "",
      diet: initialData?.diet || "",
      lifespan_years: initialData?.lifespan_years || "",
      weight_kg: initialData?.weight_kg || "",
      height_cm: initialData?.height_cm || "",
      avg_speed_kmh: initialData?.avg_speed_kmh || "",
      top_speed_kmh: initialData?.top_speed_kmh || "",
      social_structure: initialData?.social_structure || "",
      conservation_status: initialData?.conservation_status || "",
      predators: initialData?.predators || "",
      image: initialData?.image || "",
      image_source: initialData?.image_source || "",
      tags: initialData?.tags || [],
      countries: initialData?.countries || [],
      habitats: initialData?.habitats || [],
      synonyms: initialData?.synonyms || "",
    },
  });

  const commonName = watch("name");
  const imageUrl = watch("image");
  const imageSource = watch("image_source");
  const scientificName = watch("scientific_name");
  const description = watch("description");
  const descriptionSource = watch("description_source");
  const diet = watch("diet");
  const tags = watch("tags");
  const family = watch("family");
  const genus = watch("genus");
  const ordo = watch("ordo");

  const onSubmit = async (data: CreateAnimalInput) => {
    if (onSubmitOverride) {
      setIsSubmitting(true);
      try {
        await onSubmitOverride(data);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    setIsSubmitting(true);
    try {
      const url = isEditing ? `/api/animals/${initialData.id}` : "/api/animals";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorPayload = await response
          .json()
          .catch(() => ({ message: `Failed to ${isEditing ? "update" : "create"} animal` }));

        throw new Error(
          errorPayload.message ||
          `Failed to ${isEditing ? "update" : "create"} animal`
        );
      }

      toast.success(`Animal ${isEditing ? "updated" : "created"} successfully!`);
      router.push("/admin/animals");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20"
        style={{ scrollbarGutter: 'stable' }}
      >
        {/* Knowledge Helper Notification */}
        <div className="lg:col-span-2 bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary font-['Plus_Jakarta_Sans']">Smart Taxonomy Assist</h4>
            <p className="text-xs text-primary/70 font-['Manrope']">
              <strong>Family</strong> and <strong>Genus</strong> fields auto-suggest from existing database records.
              If no match is found, use the <strong className="text-[#4285F4]">G</strong><strong className="text-[#EA4335]">o</strong><strong className="text-[#FBBC05]">o</strong><strong className="text-[#4285F4]">g</strong><strong className="text-[#34A853]">l</strong><strong className="text-[#EA4335]">e</strong> link next to field labels to search online.
            </p>
          </div>
        </div>

        {/* AI Auto-Fill Assistant */}
        <div className="lg:col-span-2">
          <AnimalAiAutofill
            classes={classes}
            initialCountries={initialCountries}
            setValue={setValue}
          />
        </div>

        {/* Left Column (Identity & Description) */}
        <div className="flex flex-col gap-8">
          <AnimalIdentityCard register={register} errors={errors} setValue={setValue} watch={watch} commonName={commonName} />
          <AnimalDescriptionCard register={register} errors={errors} commonName={commonName} />
        </div>

        {/* Right Column (Classification & Physical Stats) */}
        <div className="flex flex-col gap-8">
          <AnimalClassificationCard register={register} errors={errors} classes={classes} commonName={commonName} />
          <AnimalDetailStatsCard register={register} errors={errors} setValue={setValue} watch={watch} commonName={commonName} />
        </div>

        {/* Full-Width Footer Section (Fluid Distribution, Tags, Media, Actions at bottom) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <AnimalDistributionCard setValue={setValue} watch={watch} initialCountries={initialCountries} commonName={commonName} />
          <AnimalTagCard setValue={setValue} watch={watch} />
          <AnimalMediaCard register={register} setValue={setValue} watch={watch} errors={errors} commonName={commonName} onPreview={() => setIsPreviewOpen(true)} isSafetyBlurEnabled={isReviewMode} />
          <AnimalFormActions isSubmitting={isSubmitting} isDirty={isDirty} isValid={isValid} isEditing={isEditing} onCancel={onCancelOverride} onReject={onRejectOverride} />
        </div>
      </form>

      {isPreviewOpen && imageUrl && (
        <AnimalPreviewModal
          imageUrl={imageUrl}
          imageSource={imageSource}
          commonName={commonName}
          scientificName={scientificName}
          description={description}
          descriptionSource={descriptionSource}
          diet={diet}
          tags={tags}
          taxonomy={{
            family: family,
            genus: genus,
            order: ordo,
          }}
          onApply={(newUrl) => setValue("image", newUrl, { shouldDirty: true })}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </>
  );
}

