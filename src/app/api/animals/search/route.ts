import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    // Query animals table with insensitive string matching
    // Include the first image_url in a single, highly optimized batch query (N+1 safe)
    const animals = await prisma.animals.findMany({
      where: {
        OR: [
          { animal_name: { contains: query, mode: "insensitive" } },
          { scientific_name: { contains: query, mode: "insensitive" } },
        ],
        is_visible: true,
      },
      select: {
        id: true,
        animal_name: true,
        scientific_name: true,
        animal_images: {
          select: {
            image_url: true,
          },
          take: 1,
        },
      },
      take: 8,
    });

    // Structure the results cleanly for the dropdown UI
    const results = animals.map((item) => ({
      id: item.id,
      name: item.animal_name || "",
      scientificName: item.scientific_name || "",
      imageUrl: item.animal_images[0]?.image_url || "",
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("[ANIMAL_SEARCH_API_ERROR]", error);
    return NextResponse.json({ error: "Failed to search animals" }, { status: 500 });
  }
}
