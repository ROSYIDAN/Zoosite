import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/user.schema";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string | null;
    bio: string | null;
  };
  onUpdateSuccess: (updated: { name: string; bio: string | null }) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Updating your profile...");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully!", { id: toastId });
      onUpdateSuccess({
        name: data.name,
        bio: data.bio || null,
      });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while updating profile", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full bg-[#fafaf5] border border-[#c2c9bb] p-6 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline font-semibold text-[#1a1c19] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2d5a27]">edit</span>
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-sm text-[#42493e] font-body mt-1">
            Update your display name and bio. These are visible on your curator profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-semibold text-[#1a1c19] font-body">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-2.5 rounded-xl border border-[#c2c9bb] bg-[#ffffff] text-[#1a1c19] focus:outline-none focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent transition-all font-body"
              placeholder="e.g. Jane Doe"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-xs text-[#ba1a1a] font-semibold mt-0.5">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="bio" className="text-sm font-semibold text-[#1a1c19] font-body">
                Bio / Motto
              </label>
              <span className="text-xs text-[#42493e] font-body">
                Max 160 chars
              </span>
            </div>
            <textarea
              id="bio"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-[#c2c9bb] bg-[#ffffff] text-[#1a1c19] focus:outline-none focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent transition-all font-body resize-none"
              placeholder="Tell other curators about yourself or share your wildlife tagline..."
              {...register("bio")}
            />
            {errors.bio && (
              <span className="text-xs text-[#ba1a1a] font-semibold mt-0.5">
                {errors.bio.message}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#c2c9bb]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#42493e] hover:bg-[#eeeee9] transition-colors cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#154212] hover:bg-[#2d5a27] active:bg-[#154212] transition-colors flex items-center gap-1.5 shadow-md shadow-[#154212]/10 cursor-pointer disabled:opacity-55"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
