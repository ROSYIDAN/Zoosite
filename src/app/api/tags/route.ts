import { NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { tagRepo } from "@/repositories/tag.repo";

export async function GET() {
  try {
    const tags = await tagRepo.findAll();
    return NextResponse.json(tags);
  } catch (error) {
    return handleError(error);
  }
}
