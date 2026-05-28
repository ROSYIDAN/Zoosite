import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { trendingQuerySchema } from "@/lib/validations/dashboard.schema";
import { dashboardService } from "@/services/dashboard.service";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parsed = trendingQuerySchema.safeParse({
      detail: searchParams.get("detail") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await dashboardService.getTrending(parsed.data);
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
