import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { exploreRegionQuerySchema } from "@/lib/validations/dashboard.schema";
import { dashboardService } from "@/services/dashboard.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parsed = exploreRegionQuerySchema.safeParse({
      region: searchParams.get("region"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await dashboardService.exploreRegion(parsed.data);
    const limit = 10;
    const paginatedData = result.slice(0, limit);
    return NextResponse.json({
      data: paginatedData,
      meta: { total: result.length, page: 1, limit }
    });
  } catch (error) {
    return handleError(error);
  }
}
