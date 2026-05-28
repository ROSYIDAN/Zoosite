import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { statsQuerySchema } from "@/lib/validations/dashboard.schema";
import { dashboardService } from "@/services/dashboard.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parsed = statsQuerySchema.safeParse({
      region: searchParams.get("region") || undefined,
      habitat: searchParams.get("habitat") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await dashboardService.getStatsAnimalsLived(parsed.data);
    return NextResponse.json({ data: result });
  } catch (error) {
    return handleError(error);
  }
}
