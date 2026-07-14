import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { animalRequestService } from "@/services/animal-request.service";
import { userRepo } from "@/repositories/user.repo";
import RequestHistory from "@/components/features/requests/request-history";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import { MasteryGate } from "@/components/features/quiz/shared/mastery-gate";

export default async function MyRequestsPage() {
  const session = await auth();

  // Guard: User must be authenticated to check history
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch request history, rejection strikes, and user ban details
  const { requests, rejectionCount } = await animalRequestService.getUserHistory(session.user.id);
  const user = await userRepo.getUserById(session.user.id);
  const isTempBanned = user?.request_banned_until && new Date(user.request_banned_until) > new Date();
  const isBanned = !!(user?.is_request_banned || isTempBanned);
  const bannedUntil = user?.request_banned_until ? user.request_banned_until.toISOString() : null;

  // Map to serializable props for Client Component
  const serializableRequests = JSON.parse(JSON.stringify(requests));

  return (
    <DashboardLayout>
      <div className="p-6 md:p-12 max-w-screen-2xl w-full mx-auto">
        <MasteryGate>
          <RequestHistory
            initialRequests={serializableRequests}
            initialRejectionCount={rejectionCount}
            isBanned={isBanned}
            bannedUntil={bannedUntil}
          />
        </MasteryGate>
      </div>
    </DashboardLayout>
  );
}
