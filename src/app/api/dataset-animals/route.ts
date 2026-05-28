import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { limitQuerySchema } from "@/lib/validations/common.schema";
import { datasetAnimalService } from "@/services/dataset-animal.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parsed = limitQuerySchema.safeParse({
      limit: searchParams.get("limit") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await datasetAnimalService.list(parsed.data) as any[];
    const limit = parsed.data.limit || 10;
    return NextResponse.json({
      data: result,
      meta: { total: result.length, page: 1, limit }
    });
  } catch (error) {
    return handleError(error);
  }
}
