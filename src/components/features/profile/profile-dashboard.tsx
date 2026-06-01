"use client";

import React, { useState, useEffect } from "react";
import { useQuizStore } from "@/store/quiz.store";
import { useSession } from "next-auth/react";
import { ProfileHeroCard } from "./profile-hero-card";
import { ProfileMasterySection } from "./profile-mastery-section";
import { ProfileContributionsSection } from "./profile-contributions-section";
import { ProfileHealthSection } from "./profile-health-section";
import { ProfileEditModal } from "./profile-edit-modal";
import { AvatarViewModal } from "./avatar-view-modal";

interface ContributionItem {
  id: string;
  animal_name: string | null;
  canonical_slug: string | null;
  image_url: string | null;
}

interface ProfileDashboardProps {
  initialData: {
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
      bio: string | null;
      image_position: string | null;
      image_scale: number | null;
      role: string;
      createdAt: string;
      is_request_banned: boolean;
      request_banned_until: string | null;
      rejections_reset_at: string | null;
    };
    stats: {
      approvedCount: number;
      pendingCount: number;
      inReviewCount: number;
      rejectionCount: number;
    };
    approvedContributions: ContributionItem[];
    avatarAnimal: {
      animal_name: string | null;
      canonical_slug: string | null;
    } | null;
  };
}

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  initialData,
}) => {
  const { data: session } = useSession();
  const [user, setUser] = useState(initialData.user);
  const [stats, setStats] = useState(initialData.stats);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync state with NextAuth session updates
  useEffect(() => {
    if (session?.user) {
      setUser((prev) => ({
        ...prev,
        image: session.user.image || prev.image,
        image_position: session.user.image_position || prev.image_position,
        image_scale: session.user.image_scale || prev.image_scale,
        name: session.user.name || prev.name,
      }));
    }
  }, [session]);

  // Safely retrieve quiz completed levels from client-side Zustand store to avoid hydration mismatch
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const storeCompletedLevels = useQuizStore((state) => state.completedLevels);

  useEffect(() => {
    setMounted(true);
    setCompletedLevels(storeCompletedLevels);
  }, [storeCompletedLevels]);

  const handleUpdateSuccess = (updated: { name: string; bio: string | null }) => {
    setUser((prev) => ({
      ...prev,
      name: updated.name,
      bio: updated.bio,
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-1 py-2 sm:px-0">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-headline font-bold text-[#1a1c19]">
          My Profile
        </h1>
        <p className="text-sm text-[#42493e] font-body mt-1">
          Manage your curator identity, track quiz achievements, and review contribution health.
        </p>
      </div>

      {/* Hero Header Card */}
      <ProfileHeroCard
        user={user}
        completedLevels={completedLevels}
        approvedCount={stats.approvedCount}
        onEditClick={() => setIsEditOpen(true)}
        onAvatarClick={() => setIsViewOpen(true)}
      />

      {/* Main Grid: Left column (Contributions), Right column (Mastery + Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contributions List - takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <ProfileContributionsSection
            stats={stats}
            approvedContributions={initialData.approvedContributions}
          />
        </div>

        {/* Widgets Panel - takes 1 column on large screens */}
        <div className="flex flex-col gap-6">
          {/* Quiz achievements widget */}
          <ProfileMasterySection completedLevels={completedLevels} />

          {/* Account health/strikes widget */}
          <ProfileHealthSection
            user={user}
            rejectionCount={stats.rejectionCount}
          />
        </div>
      </div>

      {/* Edit Profile Dialog Modal */}
      {isEditOpen && (
        <ProfileEditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          user={{
            name: user.name,
            bio: user.bio,
          }}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* View Profile Picture Lightbox Modal */}
      {isViewOpen && user.image && (
        <AvatarViewModal
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          user={user}
          avatarAnimal={initialData.avatarAnimal}
        />
      )}
    </div>
  );
};
