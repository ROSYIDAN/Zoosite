import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { userService } from "@/services/user.service";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import { ProfileDashboard } from "@/components/features/profile/profile-dashboard";

export const metadata = {
  title: "My Profile | ZooSite",
  description: "Curator identity, achievements, and contribution health dashboard on ZooSite.",
};

export default async function ProfilePage() {
  const session = await auth();

  // Guard: User must be authenticated to access profile page
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch complete profile details, contribution stats, and approved submissions
  const profileData = await userService.getProfileData(session.user.id);

  // Map to serializable props to safe-pass Prisma types to the Client Component
  const serializableData = JSON.parse(JSON.stringify(profileData));

  return (
    <DashboardLayout>
      <div className="p-6 md:p-12 max-w-screen-2xl w-full mx-auto">
        <ProfileDashboard initialData={serializableData} />
      </div>
    </DashboardLayout>
  );
}
