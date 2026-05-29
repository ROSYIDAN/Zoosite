"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AnimalForm from "@/components/features/admin/animals/AnimalForm";
import type { CreateAnimalInput } from "@/lib/validations/animal.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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

  const handleRejectReview = async () => {
    if (!rejectReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }

    const toastId = toast.loading("Rejecting request...");
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECT", reject_reason: rejectReason }),
      });

      if (res.ok) {
        toast.success("Request rejected successfully.", { id: toastId });
        setIsRejectOpen(false);
        router.push("/admin/requests");
        router.refresh();
      } else {
        const json = await res.json().catch(() => ({}));
        toast.error(json.message || "Failed to reject request.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.", { id: toastId });
    }
  };

  return (
    <>
      <AnimalForm
        classes={classes}
        initialData={initialData}
        initialCountries={initialCountries}
        onSubmitOverride={handleSubmitReview}
        onCancelOverride={handleCancelReview}
        onRejectOverride={() => setIsRejectOpen(true)}
      />

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Species Request</DialogTitle>
            <DialogDescription>
              Please provide feedback to the user explaining why their request is being rejected. The uploaded reference image will be permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            placeholder="e.g. Please provide a clearer reference image, or double-check the scientific classification."
            className="w-full px-4 py-2.5 border border-[#c2c9bb] rounded-xl outline-none focus:border-[#2d5a27] text-xs font-['Manrope'] bg-[#fafaf5]/50 focus:ring-1 focus:ring-[#2d5a27]/30 text-[#1a1c19]"
          />

          <DialogFooter>
            <button
              onClick={() => setIsRejectOpen(false)}
              className="px-4 py-2 border border-[#c2c9bb] text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl transition-all text-[#1a1c19]/60 hover:bg-[#fafaf5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectReview}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Reject & Purge
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
