import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { animalDistributionQuerySchema } from "@/lib/validations/animal-distribution.schema";
import { animalDistributionService } from "@/services/animal-distribution.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parsed = animalDistributionQuerySchema.safeParse({
      name: searchParams.get("name"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await animalDistributionService.getDistributionByName(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
