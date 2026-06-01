import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { auth } from "@/auth";
import { userService } from "@/services/user.service";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { image, image_position, image_scale } = body;

    const updatedUser = await userService.updateAvatar(session.user.id, {
      image,
      image_position,
      image_scale,
    });

    return NextResponse.json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return handleError(error);
  }
}
