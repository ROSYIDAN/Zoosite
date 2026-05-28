import { NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { dashboardService } from "@/services/dashboard.service";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await dashboardService.getStatsTotals();
    return NextResponse.json({ data: result });
  } catch (error) {
    return handleError(error);
  }
}
