import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { animalService } from "@/services/animal.service";
import { slugParamSchema } from "@/lib/validations/animal.schema";

import { createAnimalSchema } from "@/lib/validations/animal.schema";
import { animalRepo } from "@/repositories/animal.repo";
import { tagRepo } from "@/repositories/tag.repo";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const parsed = slugParamSchema.safeParse({ slug });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await animalService.getBySlug(parsed.data.slug);
    return NextResponse.json({ data: result });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: id } = await params; // Here 'slug' is actually the ID from the admin URL
    const body = await req.json();
    
    const parsed = createAnimalSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { tags, ...rest } = parsed.data;

    // Resolve tag IDs (create new ones if necessary)
    let tagIds: string[] = [];
    if (tags && tags.length > 0) {
      const dbTags = await tagRepo.findOrCreate(tags);
      tagIds = dbTags.map(t => t.id);
    }

    const updatedAnimal = await animalRepo.updateWithRelations(id, {
      ...rest,
      tags: tagIds,
    });

    return Response.json({ data: updatedAnimal }, { status: 200 });
  } catch (error) {
    console.error("[ANIMAL_UPDATE]", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
