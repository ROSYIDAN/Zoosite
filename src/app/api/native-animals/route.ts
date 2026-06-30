import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { userService } from "@/services/user.service";
import { handleError } from "@/lib/errors";
import { animalDistributionService } from "@/services/animal-distribution.service";
import { nativeAnimalsQuerySchema } from "@/lib/validations/animal-distribution.schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let countryId = searchParams.get("countryId");
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || undefined;
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const sortBy = searchParams.get("sortBy") || undefined;

    // If countryId is not provided, fall back to the authenticated user's home country
    if (!countryId) {
      const session = await auth();
      if (session?.user?.id) {
        const profile = await userService.getProfileData(session.user.id);
        countryId = profile.user.country_id || null;
      }
    }

    // If there is still no country selected/defined, return a clean empty response
    if (!countryId) {
      return NextResponse.json({
        animals: [],
        country: null,
        pagination: {
          total: 0,
          page: page ? parseInt(page) : 1,
          limit: limit ? parseInt(limit) : 12,
          totalPages: 0,
        },
      });
    }

    const parsed = nativeAnimalsQuerySchema.safeParse({
      countryId,
      status,
      search,
      page,
      limit,
      sortBy,
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