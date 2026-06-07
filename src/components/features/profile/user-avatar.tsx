import React from "react";
import Image from "next/image";

interface UserAvatarProps {
  image: string | null | undefined;
  name: string | null | undefined;
  email: string | null | undefined;
  image_position?: string | null | undefined;
  image_scale?: number | null | undefined;
  className?: string;
  sizes?: string;
  onClick?: () => void;
  title?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  image,
  name,
  email,
  image_position,
  image_scale = 1.0,
  className = "w-9 h-9",
  sizes = "36px",
  onClick,
  title,
}) => {
  // Parse translation offset percentages
  const getTranslationValues = () => {
    if (!image_position || image_position === "50% 50%") {
      return { x: 0, y: 0 };
    }
    try {
      const parts = image_position.replace(/[^0-9.\-\s%]/g, "").trim().split(/\s+/);
      const x = parseFloat(parts[0] || "0");
      const y = parseFloat(parts[1] || "0");
      return { x, y };
    } catch {
      return { x: 0, y: 0 };
    }
  };

  const { x, y } = getTranslationValues();
  const cleanImage = image ? image.split("#")[0] : null;

  const nameInitial = name
    ? name.trim().charAt(0).toUpperCase()
    : email
    ? email.trim().charAt(0).toUpperCase()
    : "U";

  return (
    <div
      onClick={onClick}
      className={`rounded-full overflow-hidden relative bg-[#2d5a27] text-white flex items-center justify-center font-headline font-bold shrink-0 select-none border border-black/10 shadow-sm ${className} ${
        onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : ""
      }`}
      title={title}
    >
      {cleanImage ? (
        <Image
          src={cleanImage}
          alt={name || "User avatar"}
          fill
          unoptimized
          className="object-cover"
          style={{
            transform: `translate(${x}%, ${y}%) scale(${image_scale || 1.0})`,
          }}
          sizes={sizes}
        />
      ) : (
        <span>{nameInitial}</span>
      )}
    </div>
  );
};
