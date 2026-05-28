import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { animalRequestRepo } from "@/repositories/animal-request.repo";
import AdminRequestsTable from "@/components/features/admin/requests/admin-requests-table";

export default async function AdminRequestsPage() {
  const session = await auth();

  // Guard: User must be authenticated and have the ADMIN role
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/forbidden");
  }

  // 1. Fetch all requests
  const requests = await animalRequestRepo.listAllForAdmin();

  // 2. Fetch classes for the dropdown editing panel
  const classes = await prisma.animal_class.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  // Map to serializable props
  const serializableRequests = JSON.parse(JSON.stringify(requests));

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <AdminRequestsTable 
        initialRequests={serializableRequests} 
        classes={classes} 
      />
    </div>
  );
}
