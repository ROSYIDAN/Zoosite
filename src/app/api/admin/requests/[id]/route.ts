import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { auth } from "@/auth";
import { animalRequestService } from "@/services/animal-request.service";
import { UserRole } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ message: "Action is required" }, { status: 400 });
    }

    switch (action) {
      case "LOCK": {
        await animalRequestService.lockRequest(id);
        return NextResponse.json({ message: "Request locked for review" });
      }
      case "REJECT": {
        const { reject_reason } = body;
        if (!reject_reason) {
          return NextResponse.json({ message: "Rejection reason is required" }, { status: 400 });
        }
        await animalRequestService.rejectRequest(id, reject_reason);
        return NextResponse.json({ message: "Request rejected successfully" });
      }
      case "APPROVE": {
        const { approvedFields } = body;
        if (!approvedFields) {
          return NextResponse.json({ message: "Approved fields are required" }, { status: 400 });
        }
        const animal = await animalRequestService.approveRequest(id, approvedFields);
        return NextResponse.json({ message: "Request approved and animal created", data: animal }, { status: 201 });
      }
      case "BAN": {
        const { userId, isBanned, durationDays } = body;
        if (!userId) {
          return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }
        const result = await animalRequestService.banUser(userId, isBanned ?? true, durationDays);
        return NextResponse.json({ message: isBanned ? "User privileges updated" : "User unbanned", data: result });
      }
      default: {
        return NextResponse.json({ message: `Unsupported action: ${action}` }, { status: 400 });
      }
    }
  } catch (error) {
    return handleError(error);
  }
}
