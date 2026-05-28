import { NextRequest, NextResponse } from "next/server";
import { animalService } from "@/services/animal.service";
import path from "path";
import fs from "fs/promises";

/**
 * GET /api/animals/[slug]/image
 * Resolves the ImgBB URL for the animal and redirects the client to the CDN.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get animal ID from slug via the service layer
    const animalId = await animalService.getIdBySlug(slug);

    let imgbbUrl = await animalService.getImgbbUrl(animalId);
    
    // Substitute domain to match user preferred format
    if (imgbbUrl.includes("i.ibb.co") && !imgbbUrl.includes("i.ibb.co.com")) {
      imgbbUrl = imgbbUrl.replace("i.ibb.co", "i.ibb.co.com");
    }
    
    // Proxy the image
    const response = await fetch(imgbbUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from source: ${response.statusText}`);
    }

    const blob = await response.blob();
    const contentType = response.headers.get("Content-Type") || "image/jpeg";

    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error(`[IMAGE_PROXY_ERROR] Serving fallback for slug:`, error.message);
    try {
      const fallbackPath = path.join(process.cwd(), "public", "static_image.png");
      const fallbackBuffer = await fs.readFile(fallbackPath);
      return new NextResponse(fallbackBuffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (fallbackError: any) {
      console.error("[FATAL_FALLBACK_ERROR] Fallback image missing:", fallbackError.message);
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }
  }
}

