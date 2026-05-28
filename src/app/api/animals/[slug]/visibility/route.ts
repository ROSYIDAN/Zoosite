import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

/**
 * PATCH /api/animals/[id]/visibility
 * Securely toggles visibility status for a species (Admin only).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 1. Authenticate & authorize the admin
    const session = await auth();
    if (!session || session.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug: id } = await params; // 'slug' corresponds to the animal UUID in the admin endpoints
    const body = await request.json();
    const { is_visible } = body;

    if (typeof is_visible !== "boolean") {
      return NextResponse.json(
        { error: "Invalid parameters. 'is_visible' must be a boolean." },
        { status: 400 }
      );
    }

    // 2. Perform direct lightweight update
    const updated = await prisma.animals.update({
      where: { id },
      data: { is_visible },
      select: {
        id: true,
        is_visible: true,
        animal_name: true,
      },
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error: any) {
    console.error("[ANIMAL_VISIBILITY_PATCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
