import { NextRequest, NextResponse } from "next/server";
import { uploadBufferToImgbb } from "@/lib/image-utils";
import { handleError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadBufferToImgbb(buffer);

    return NextResponse.json({ url });
  } catch (error) {
    return handleError(error);
  }
}
