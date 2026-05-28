import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/animals/taxonomy?field=genus|family|ordo&q=search&class_id=...&family=...&ordo=...
 * Returns distinct taxonomy values from existing animals for autocomplete.
 * Supports optional filters to narrow results cascadingly.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const field = searchParams.get("field");
  const query = searchParams.get("q") || "";
  const classId = searchParams.get("class_id");
  const family = searchParams.get("family");
  const ordo = searchParams.get("ordo");

  if (!field || !["genus", "family", "ordo"].includes(field)) {
    return NextResponse.json(
      { error: "Invalid field. Must be one of: genus, family, ordo" },
      { status: 400 }
    );
  }

  // Diagnostic log to trace exactly what parameters the API receives from the form
  console.log(`[Taxonomy API GET] field: ${field} | q: "${query}" | class_id: ${classId || "none"} | family: ${family || "none"} | ordo/diet: ${ordo || "none"}`);

  try {
    // Build conditions dynamically — field is whitelisted above, safe to interpolate
    const conditions = [`${field} IS NOT NULL`, `${field} != ''`];
    const params: any[] = [];

    // $1 — always the search text
    params.push(`%${query}%`);
    conditions.push(`${field} ILIKE $1`);

    let idx = 2;

    if (classId) {
      conditions.push(`class_id = $${idx}::uuid`);
      params.push(classId);
      idx++;
    }

    if (family) {
      conditions.push(`family ILIKE $${idx}`);
      params.push(family);
      idx++;
    }

    if (ordo) {
      conditions.push(`ordo ILIKE $${idx}`);
      params.push(ordo);
      idx++;
    }

    const sql = `
      SELECT DISTINCT ${field} AS value
      FROM animals
      WHERE ${conditions.join(" AND ")}
      ORDER BY value ASC
      LIMIT 20
    `;

    const results = await prisma.$queryRawUnsafe<{ value: string }[]>(sql, ...params);

    return NextResponse.json(results.map((r) => r.value));
  } catch (error) {
    console.error("[taxonomy] Error fetching values:", error);
    return NextResponse.json(
      { error: "Failed to fetch taxonomy data" },
      { status: 500 }
    );
  }
}

