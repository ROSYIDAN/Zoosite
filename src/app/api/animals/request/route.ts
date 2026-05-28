import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { auth } from "@/auth";
import { animalRequestService } from "@/services/animal-request.service";
import { requestAnimalSchema } from "@/lib/validations/animal-request.schema";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await animalRequestService.getUserHistory(session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = requestAnimalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await animalRequestService.createRequest(parsed.data, session.user.id);
    return NextResponse.json({ message: "Request submitted successfully", data: result }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
