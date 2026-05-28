import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { auth } from "@/auth";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadBufferToCloudinary(buffer);

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
