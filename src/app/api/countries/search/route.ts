import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    // Query countries table with insensitive string matching in a single query (N+1 safe)
    const countries = await prisma.countries.findMany({
      where: {
        country: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        country: true,
        country_flag: true,
      },
      take: 8,
    });

    // Structure results cleanly for search suggestions
    const results = countries.map((item) => ({
      id: item.id,
      name: item.country || "",
      flagUrl: item.country_flag || "",
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("[COUNTRY_SEARCH_API_ERROR]", error);
    return NextResponse.json({ error: "Failed to search countries" }, { status: 500 });
  }
}
