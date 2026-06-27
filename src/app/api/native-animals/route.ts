import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { animalDistributionService } from "@/services/animal-distribution.service";
import { nativeAnimalsQuerySchema } from "@/lib/validations/animal-distribution.schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get("countryId");
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || undefined;
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;

    const parsed = nativeAnimalsQuerySchema.safeParse({
      countryId,
      status,
      search,
      page,
      limit,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await animalDistributionService.getNativeAnimals(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}