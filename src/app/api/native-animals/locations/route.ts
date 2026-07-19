import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
import { userService } from "@/services/user.service";
import { handleError } from "@/lib/errors";
import { animalDistributionService } from "@/services/animal-distribution.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let countryId = searchParams.get("countryId");

    // If countryId is not provided, fall back to the authenticated user's home country
    if (!countryId) {
      const session = await auth();
      if (session?.user?.id) {
        const profile = await userService.getProfileData(session.user.id);
        countryId = profile.user.country_id || null;
      }
    }

    // If there is still no country selected/defined, return empty options
    if (!countryId) {
      return NextResponse.json({
        regions: [],
        provinces: [],
        localities: [],
      });
    }

    // Validate that countryId is a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(countryId)) {
      return NextResponse.json(
        { message: "Invalid country ID format" },
        { status: 400 }
      );
    }

    const result = await animalDistributionService.getLocationFilterOptions(countryId);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}