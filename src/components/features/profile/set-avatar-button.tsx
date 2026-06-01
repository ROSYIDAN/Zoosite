"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { AvatarAdjustModal } from "./avatar-adjust-modal";

interface SetAvatarButtonProps {
  imageUrl: string;
  animalName: string;
}

export const SetAvatarButton: React.FC<SetAvatarButtonProps> = ({
  imageUrl,
  animalName,
}) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) return null;

  const isCurrentAvatar = session.user.image === imageUrl;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`group/btn relative flex items-center justify-start h-10 w-10 ${isCurrentAvatar ? "hover:w-[115px]" : "hover:w-[145px]"
          } transition-all duration-300 ease-out rounded-full border cursor-pointer select-none overflow-hidden shadow-lg backdrop-blur-md ${isCurrentAvatar
            ? "bg-[#154212]/60 border-[#a1d494]/40 text-[#dcfce7] hover:bg-[#154212]/80 hover:border-[#a1d494]/60"
            : "bg-black/35 border-white/20 text-white hover:bg-[#2d5a27]/80 hover:border-[#a1d494]/40"
          }`}
        title={isCurrentAvatar ? "Current profile picture" : "Set as profile picture"}
      >
        <span style={{ display: "flex" }} className="material-symbols-outlined text-[20px] items-center justify-center shrink-0 w-10 h-10">
          {isCurrentAvatar ? "check_circle" : "photo_camera"}
        </span>
        <span className="font-body text-[10px] font-bold uppercase tracking-wider whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100 pr-4">
          {isCurrentAvatar ? "Current" : "Use Avatar"}
        </span>
      </button>

      {isOpen && (
        <AvatarAdjustModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          imageUrl={imageUrl}
          animalName={animalName}
          initialPosition={session.user.image_position || undefined}
          initialScale={session.user.image_scale || undefined}
        />
      )}
    </>
  );
};
