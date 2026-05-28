import { NextRequest, NextResponse } from "next/server";
import { habitatRepo } from "@/repositories/habitat.repo";
import { handleError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const all = searchParams.get("all") === "true";

    const habitats = all ? await habitatRepo.findAll() : await habitatRepo.search(q);
    return NextResponse.json({ data: habitats });
  } catch (error) {
    return handleError(error);
  }
}
