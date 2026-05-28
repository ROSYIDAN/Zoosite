import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const animal = await prisma.animals.findUnique({
      where: { canonical_slug: "blue-jay" },
      select: { id: true, animal_name: true }
    });

    if (!animal) {
      return NextResponse.json({ error: "Animal blue-jay not found" });
    }

    const images = await prisma.animal_images.findMany({
      where: { animal_id: animal.id }
    });

    return NextResponse.json({
      animal,
      images
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
