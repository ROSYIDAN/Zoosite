import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const regions = await prisma.regions.findMany({
      orderBy: { region: "asc" },
      select: {
        id: true,
        region: true,
      },
    });

    return NextResponse.json({ data: regions });
  } catch (error) {
    return handleError(error);
  }
}
