import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AvatarAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  animalName: string;
  initialPosition?: string;
  initialScale?: number;
  onSuccess?: () => void;
}

export const AvatarAdjustModal: React.FC<AvatarAdjustModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  animalName,
  initialPosition = "50% 50%",
  initialScale = 1.0,
  onSuccess,
}) => {
  const { update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse initial position (e.g. "50% 50%" or "-10% 20%")
  const getInitialXY = () => {
    if (!initialPosition || initialPosition === "50% 50%") {
      return { x: 0, y: 0 };
    }
    try {
      const parts = initialPosition.replace(/[^0-9.\-\s%]/g, "").trim().split(/\s+/);
      const x = parseFloat(parts[0] || "0");
      const y = parseFloat(parts[1] || "0");
      return { x, y };
    } catch {
      return { x: 0, y: 0 };
    }
  };

  const initialXY = getInitialXY();
  const [posX, setPosX] = useState<number>(initialXY.x);
  const [posY, setPosY] = useState<number>(initialXY.y);
  const [scale, setScale] = useState<number>(initialScale);

  const handleSave = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Updating your profile picture...");

    try {
      const positionStr = `${posX}% ${posY}%`;
      const response = await fetch("/api/user/profile/avatar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageUrl,
          image_position: positionStr,
          image_scale: scale,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to update avatar");
      }

      // Propagate update to next-auth session to refresh headers immediately
      await update({
        image: imageUrl,
        image_position: positionStr,
        image_scale: scale,
      });

      toast.success("Profile picture updated successfully!", { id: toastId });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "An error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full bg-[#fafaf5] border border-[#c2c9bb] p-6 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline font-semibold text-[#1a1c19] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2d5a27]">photo_camera</span>
            Adjust Profile Picture
          </DialogTitle>
          <DialogDescription className="text-sm text-[#42493e] font-body mt-1">
            Position and scale the image of the {animalName} to fit nicely in your circular profile.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-6 mt-6">
          {/* Avatar Preview Frame */}
          <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg bg-[#eeeee9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Avatar preview"
              className="w-full h-full object-cover transition-transform duration-75 select-none pointer-events-none"
              style={{
                transform: `translate(${posX}%, ${posY}%) scale(${scale})`,
              }}
            />
            {/* Overlay grid to help align */}
            <div className="absolute inset-0 rounded-full border border-[#154212]/10 pointer-events-none" />
          </div>

          {/* Controls Sliders */}
          <div className="w-full space-y-4">
            {/* Zoom Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-[#1a1c19] font-body">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#42493e]">zoom_in</span>
                  Zoom Scale
                </span>
                <span>{scale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#eeeee9] rounded-lg appearance-none cursor-pointer accent-[#154212]"
              />
            </div>

            {/* Horizontal Position (X) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-[#1a1c19] font-body">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#42493e]">swap_horiz</span>
                  Horizontal Shift (X)
                </span>
                <span>{posX}%</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={posX}
                onChange={(e) => setPosX(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#eeeee9] rounded-lg appearance-none cursor-pointer accent-[#154212]"
              />
            </div>

            {/* Vertical Position (Y) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-[#1a1c19] font-body">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#42493e]">swap_vert</span>
                  Vertical Shift (Y)
                </span>
                <span>{posY}%</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={posY}
                onChange={(e) => setPosY(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#eeeee9] rounded-lg appearance-none cursor-pointer accent-[#154212]"
              />
            </div>
          </div>
        </div>

        {/* Buttons footer */}
        <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-[#c2c9bb]/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#42493e] hover:bg-[#eeeee9] transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#154212] hover:bg-[#2d5a27] active:bg-[#154212] transition-colors flex items-center gap-1.5 shadow-md shadow-[#154212]/10 cursor-pointer disabled:opacity-55"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Save Profile Picture"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
