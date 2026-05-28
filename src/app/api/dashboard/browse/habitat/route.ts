import { NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { dashboardService } from "@/services/dashboard.service";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await dashboardService.browseHabitats();
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
