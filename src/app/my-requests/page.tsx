import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { animalRequestService } from "@/services/animal-request.service";
import RequestHistory from "@/components/features/requests/request-history";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

export default async function MyRequestsPage() {
  const session = await auth();

  // Guard: User must be authenticated to check history
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch request history and rejection strikes from the service layer
  const { requests, rejectionCount } = await animalRequestService.getUserHistory(session.user.id);

  // Map to serializable props for Client Component
  const serializableRequests = JSON.parse(JSON.stringify(requests));

  return (
    <DashboardLayout>
      <div className="p-6 md:p-12 max-w-screen-2xl w-full mx-auto">
        <RequestHistory
          initialRequests={serializableRequests}
          initialRejectionCount={rejectionCount}
        />
      </div>
    </DashboardLayout>
  );
}
