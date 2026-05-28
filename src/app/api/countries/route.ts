import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const all = searchParams.get("all") === "true";

    const countries = await prisma.countries.findMany({
      where: {
        country: {
          contains: q,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        country: true,
        country_flag: true,
        region_id: true,
        regions: {
          select: {
            id: true,
            region: true,
          },
        },
      },
      take: all ? undefined : 100,
      orderBy: { country: "asc" },
    });

    return NextResponse.json({ data: countries });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { country, country_flag, region_id } = body;

    if (!country) {
      return NextResponse.json({ error: "Country name is required" }, { status: 400 });
    }

    // Check if country already exists (case-insensitive)
    const existing = await prisma.countries.findFirst({
      where: {
        country: {
          equals: country.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Country already exists" }, { status: 400 });
    }

    const newCountry = await prisma.countries.create({
      data: {
        country: country.trim(),
        country_flag: country_flag ? country_flag.trim() : null,
        region_id: region_id || null,
      },
      select: {
        id: true,
        country: true,
        country_flag: true,
        region_id: true,
        regions: {
          select: {
            id: true,
            region: true,
          },
        },
      },
    });

    return NextResponse.json({ data: newCountry }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, country, country_flag, region_id } = body;

    if (!id) {
      return NextResponse.json({ error: "Country ID is required" }, { status: 400 });
    }

    const updated = await prisma.countries.update({
      where: { id },
      data: {
        country: country ? country.trim() : undefined,
        country_flag: country_flag !== undefined ? (country_flag ? country_flag.trim() : null) : undefined,
        region_id: region_id !== undefined ? region_id : undefined,
      },
      select: {
        id: true,
        country: true,
        country_flag: true,
        region_id: true,
        regions: {
          select: {
            id: true,
            region: true,
          },
        },
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    return handleError(error);
  }
}
