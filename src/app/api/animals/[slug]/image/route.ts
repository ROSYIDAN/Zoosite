import { NextRequest, NextResponse } from "next/server";
import { animalService } from "@/services/animal.service";

/**
 * GET /api/animals/[slug]/image
 * Resolves the ImgBB URL for the animal and redirects the client to the CDN.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Get animal ID from slug via the service layer
  let animalId: string;
  try {
    animalId = await animalService.getIdBySlug(slug);
  } catch {
    return NextResponse.json(
      { error: "Animal not found" },
      { status: 404 }
    );
  }

  try {
    let imgbbUrl = await animalService.getImgbbUrl(animalId);
    
    // Substitute domain to match user preferred format
    if (imgbbUrl.includes("i.ibb.co") && !imgbbUrl.includes("i.ibb.co.com")) {
      imgbbUrl = imgbbUrl.replace("i.ibb.co", "i.ibb.co.com");
    }
    
    // Proxy the image
    const response = await fetch(imgbbUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image from ImgBB: ${response.statusText}` },
        { status: 500 }
      );
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
    return NextResponse.json(
      { error: `Failed to resolve ImgBB image: ${error.message}` },
      { status: 500 }
    );
  }
}

