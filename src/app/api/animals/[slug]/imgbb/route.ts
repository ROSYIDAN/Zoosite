import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { animalService } from "@/services/animal.service";
import { z } from "zod";

const idParamSchema = z.object({
  slug: z.string().uuid(), // Next.js passes it as 'slug' based on folder name, but we expect a UUID
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const parsed = idParamSchema.safeParse({ slug });
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed (Expected UUID for this test)", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const animalId = parsed.data.slug; // This is the ID

    // Fetch from DB using animalService
    let imageUrl: string | null = null;
    try {
      imageUrl = await animalService.getImgbbUrl(animalId);
    } catch (err) {
      console.error("Failed to get ImgBB URL from DB:", err);
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image not found for this animal ID" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      data: { imageUrl }
    });
  } catch (error) {
    return handleError(error);
  }
}
