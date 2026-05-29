import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { animalRequestService } from "@/services/animal-request.service";
import RequestAnimalForm from "@/components/features/requests/request-animal-form";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import { MasteryGate } from "@/components/features/quiz/shared/mastery-gate";

export default async function RequestAnimalPage() {
  const session = await auth();

  // Guard: User must be authenticated to request animals
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch all required initialization data through the service layer
  const { classes, rejectionCount, isBanned } = await animalRequestService.getSubmissionPageData(session.user.id);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-12 w-full max-w-7xl mx-auto">
        <MasteryGate>
          <header className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-primary font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
              Request Animal Addition
            </h1>
            <p className="text-xs text-[#1a1c19]/60 font-['Manrope'] mt-2">
              Help us expand our wildlife database by suggesting family-friendly animals.
            </p>
          </header>

          <RequestAnimalForm
            classes={classes}
            initialRejectionCount={rejectionCount}
            isBanned={isBanned}
          />
        </MasteryGate>
      </div>
    </DashboardLayout>
  );
}
