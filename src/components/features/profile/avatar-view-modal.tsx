import React, { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserAvatar } from "./user-avatar";

interface AvatarViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string | null;
    image: string | null;
    image_position?: string | null;
    image_scale?: number | null;
  };
  avatarAnimal: {
    animal_name: string | null;
    canonical_slug: string | null;
  } | null;
}

export const AvatarViewModal: React.FC<AvatarViewModalProps> = ({
  isOpen,
  onClose,
  user,
  avatarAnimal,
}) => {
  const [activeTab, setActiveTab] = useState<"cropped" | "original">("cropped");

  if (!user.image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full bg-[#fafaf5] border border-[#c2c9bb] p-6 rounded-2xl shadow-xl flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline font-semibold text-[#1a1c19] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2d5a27]">portrait</span>
            Profile Picture
          </DialogTitle>
          <DialogDescription className="text-sm text-[#42493e] font-body mt-1">
            Viewing {user.name || "Curator"}&apos;s profile photograph.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Toggle buttons */}
        <div className="flex bg-[#eeeee9] p-1 rounded-xl w-full border border-[#c2c9bb]/40">
          <button
            onClick={() => setActiveTab("cropped")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer font-headline ${
              activeTab === "cropped"
                ? "bg-[#154212] text-white shadow-sm"
                : "text-[#42493e] hover:bg-[#fafaf5]/40"
            }`}
          >
            Curator Avatar
          </button>
          <button
            onClick={() => setActiveTab("original")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer font-headline ${
              activeTab === "original"
                ? "bg-[#154212] text-white shadow-sm"
                : "text-[#42493e] hover:bg-[#fafaf5]/40"
            }`}
          >
            Original Photo
          </button>
        </div>

        {/* Photo Display Area */}
        <div className="flex items-center justify-center py-4 min-h-[240px]">
          {activeTab === "cropped" ? (
            /* Large circular Cropped Avatar View */
            <UserAvatar
              image={user.image}
              name={user.name}
              email={null}
              image_position={user.image_position}
              image_scale={user.image_scale}
              className="w-60 h-60 border-4 border-white shadow-lg text-6xl font-bold font-headline"
              sizes="240px"
            />
          ) : (
            /* Full uncropped aspect ratio Photo View */
            <div className="relative rounded-2xl overflow-hidden border-2 border-white shadow-md bg-[#eeeee9] max-w-full max-h-[300px] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.image}
                alt="Original conservatory photograph"
                className="object-contain max-h-[280px] max-w-full"
              />
            </div>
          )}
        </div>

        {/* Dynamic Animal Encyclopedia Connection */}
        {avatarAnimal && (
          <div className="p-4 rounded-2xl bg-[#2d5a27]/10 border border-[#2d5a27]/25 text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[#154212] text-2xl">eco</span>
            <div>
              <p className="text-sm font-semibold text-[#1a1c19] font-headline">
                Encyclopedia Connection
              </p>
              <p className="text-xs text-[#42493e] font-body max-w-sm mt-0.5">
                Your profile picture is the official conservatory photograph for the <strong>{avatarAnimal.animal_name}</strong>.
              </p>
            </div>
            <Link
              href={`/animals/${avatarAnimal.canonical_slug}`}
              className="mt-1 px-4 py-2 bg-[#154212] hover:bg-[#2d5a27] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              Read Species Entry
            </Link>
          </div>
        )}

        {/* Close Button */}
        <div className="flex items-center justify-end pt-2 border-t border-[#c2c9bb]/40">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#154212] hover:bg-[#2d5a27] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
