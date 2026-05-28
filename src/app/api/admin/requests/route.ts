import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { auth } from "@/auth";
import { animalRequestService } from "@/services/animal-request.service";
import { UserRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const result = await animalRequestService.listAdminRequests();
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
