import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import confetti from "canvas-confetti";
import { requestAnimalSchema, type RequestAnimalInput } from "@/lib/validations/animal-request.schema";

export function useRequestAnimalForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"QUICK" | "FULL_DETAIL">("QUICK");
  const [isUploading, setIsUploading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameCheckResult, setNameCheckResult] = useState<{
    exists: boolean;
    isUnderReview: boolean;
    animal?: { canonical_slug: string; animal_name: string; scientific_name: string; family: string };
    request?: { animal_name: string; status: string };
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RequestAnimalInput>({
    resolver: zodResolver(requestAnimalSchema),
    mode: "onChange",
    defaultValues: {
      request_type: "QUICK",
      animal_name: "",
      image_url: "",
      image_public_id: "",
      scientific_name: "",
      family: "",
      genus: "",
      ordo: "",
      class_id: "",
      description: "",
      description_source: "",
      diet: "",
      lifespan_years: "",
      weight_kg: "",
      height_cm: "",
      avg_speed_kmh: "",
      top_speed_kmh: "",
      social_structure: "",
      conservation_status: "",
      predators: "",
      synonyms: "",
    },
  });

  const animalName = watch("animal_name");
  const imageUrl = watch("image_url");

  // Sync request type with current active tab
  useEffect(() => {
    setValue("request_type", activeTab);
  }, [activeTab, setValue]);

  // Client-side pre-fill for "Fix & Resubmit" feature
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("resubmit") === "true") {
      const stored = localStorage.getItem("resubmit_animal_request");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setActiveTab(data.request_type || "QUICK");
          setValue("animal_name", data.animal_name || "");
          setValue("image_url", data.image_url || "");
          setValue("image_public_id", data.image_public_id || "");
          setValue("scientific_name", data.scientific_name || "");
          setValue("family", data.family || "");
          setValue("genus", data.genus || "");
          setValue("ordo", data.ordo || "");
          setValue("class_id", data.class_id || "");
          setValue("description", data.description || "");
          setValue("description_source", data.description_source || "");
          setValue("diet", data.diet || "");
          setValue("lifespan_years", data.lifespan_years || "");
          setValue("weight_kg", data.weight_kg || "");
          setValue("height_cm", data.height_cm || "");
          setValue("avg_speed_kmh", data.avg_speed_kmh || "");
          setValue("top_speed_kmh", data.top_speed_kmh || "");
          setValue("social_structure", data.social_structure || "");
          setValue("conservation_status", data.conservation_status || "");
          setValue("predators", data.predators || "");
          setValue("synonyms", data.synonyms || "");

          localStorage.removeItem("resubmit_animal_request");
          toast.success("Loaded your previous request. Please fix any errors and submit!");
        } catch (e) {
          console.error("Failed to parse resubmit data:", e);
        }
      }
    }
  }, [setValue]);

  // Debounced Animal Name check to prevent duplicate requests
  useEffect(() => {
    if (!animalName || animalName.trim().length < 2) {
      setNameCheckResult(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/animals/check?name=${encodeURIComponent(animalName)}`);
        if (res.ok) {
          const data = await res.json();
          setNameCheckResult(data);
        }
      } catch (err) {
        console.error("Error checking name duplicate:", err);
      } finally {
        setIsChecking(false);
      }
    }, 400); // 400ms debounce
  }, [animalName]);

  // Cloudinary temporary image uploader handler
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading image securely...");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/animals/request/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        setValue("image_url", json.url);
        setValue("image_public_id", json.public_id);
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        toast.error("Image upload failed. Please try again.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during image upload.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearImage = () => {
    setValue("image_url", "");
    setValue("image_public_id", "");
  };

  // Submit Handler
  const onSubmit = async (data: RequestAnimalInput) => {
    if (nameCheckResult?.exists || nameCheckResult?.isUnderReview) {
      toast.error("Cannot submit: This animal already exists or has a pending request.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your request...");
    try {
      const res = await fetch("/api/animals/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Animal request submitted successfully!", { id: toastId });
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        router.push("/my-requests");
        router.refresh();
      } else {
        const json = await res.json().catch(() => ({}));
        toast.error(json.message || "Failed to submit request.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    activeTab,
    setActiveTab,
    isUploading,
    isChecking,
    isSubmitting,
    nameCheckResult,
    imageUrl,
    handleImageUpload,
    handleClearImage,
    onSubmit,
  };
}
