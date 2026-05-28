import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { animalRequestService } from "@/services/animal-request.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "";

    const result = await animalRequestService.checkDuplicate(name);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
