import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { animalService } from "@/services/animal.service";
import {
  listAnimalsQuerySchema,
  createAnimalSchema,
} from "@/lib/validations/animal.schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parsed = listAnimalsQuerySchema.safeParse({
      limit: searchParams.get("limit") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      diet: searchParams.get("diet") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await animalService.list(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createAnimalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await animalService.create(parsed.data);
    return NextResponse.json({ message: "Animal created successfully" }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
