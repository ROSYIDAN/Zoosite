import React from "react";
import { UserAvatar } from "@/components/features/profile/user-avatar";

interface ProfileHeroCardProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
    bio: string | null;
    image_position?: string | null;
    image_scale?: number | null;
    role: string;
    createdAt: string | Date;
  };
  completedLevels: string[];
  approvedCount: number;
  onEditClick: () => void;
  onAvatarClick?: () => void;
}

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
  user,
  completedLevels,
  approvedCount,
  onEditClick,
  onAvatarClick,
}) => {
  // Determine dynamic title
  const getCuratorTitle = () => {
    if (user.role === "ADMIN") return "Administrator";
    const hasHardQuiz = completedLevels.map(c => c.toLowerCase()).includes("hard");
    if (hasHardQuiz && approvedCount >= 1) return "Master Curator";
    if (hasHardQuiz) return "Zoologist";
    return "Explorer";
  };

  const title = getCuratorTitle();
  const joinDate = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  const nameInitial = user.name
    ? user.name.trim().charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  // Color classes corresponding to titles
  const getTitleBadgeStyles = () => {
    switch (title) {
      case "Administrator":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Master Curator":
        return "bg-[#fdc39a]/30 text-[#653d1e] border-[#fdc39a]";
      case "Zoologist":
        return "bg-[#bcf0ae]/30 text-[#154212] border-[#a1d494]";
      default:
        return "bg-[#eeeee9] text-[#42493e] border-[#c2c9bb]";
    }
  };

  return (
    <div className="relative overflow-hidden w-full rounded-3xl border border-[#c2c9bb]/60 bg-[#ffffff]/60 backdrop-blur-md shadow-lg p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
      {/* Decorative gradient blur in background */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#bcf0ae]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#fdc39a]/10 blur-3xl pointer-events-none" />

      {/* Avatar Container */}
      <UserAvatar
        image={user.image}
        name={user.name}
        email={user.email}
        image_position={user.image_position}
        image_scale={user.image_scale}
        className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-white shadow-md text-3xl font-bold font-headline"
        sizes="(max-width: 768px) 96px, 112px"
        onClick={user.image ? onAvatarClick : undefined}
        title={user.image ? "View profile picture" : undefined}
      />

      {/* User Details */}
      <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-[#1a1c19]">
            {user.name || "Curator"}
          </h1>
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${getTitleBadgeStyles()}`}
          >
            {title}
          </span>
        </div>

        <p className="text-sm text-[#42493e] font-body mt-1">{user.email}</p>

        {/* Bio */}
        <p className="text-[#1a1c19] text-base font-body mt-4 max-w-xl italic leading-relaxed">
          {user.bio ? `"${user.bio}"` : '"No bio or tagline added yet. Let other curators know your passion!"'}
        </p>

        {/* Footer info */}
        <div className="flex items-center gap-2 mt-6 text-xs text-[#42493e]/80 font-body">
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          <span>Member since {joinDate}</span>
        </div>
      </div>

      {/* Edit Profile Button */}
      <button
        onClick={onEditClick}
        className="absolute top-4 right-4 md:relative md:top-0 md:right-0 p-2.5 rounded-xl border border-[#c2c9bb] bg-[#fafaf5] hover:bg-[#eeeee9] transition-colors flex items-center justify-center shadow-sm cursor-pointer group"
        aria-label="Edit Profile"
      >
        <span className="material-symbols-outlined text-[#42493e] group-hover:text-[#154212] transition-colors text-[20px]">
          edit
        </span>
      </button>
    </div>
  );
};
