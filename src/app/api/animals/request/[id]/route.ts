import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { auth } from "@/auth";
import { animalRequestService } from "@/services/animal-request.service";
import { updateRequestSchema } from "@/lib/validations/animal-request.schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = updateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await animalRequestService.updateRequest(id, parsed.data, session.user.id);
    return NextResponse.json({ message: "Request updated successfully", data: result });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await animalRequestService.withdrawRequest(id, session.user.id);
    return NextResponse.json({ message: "Request withdrawn successfully", data: result });
  } catch (error) {
    return handleError(error);
  }
}
