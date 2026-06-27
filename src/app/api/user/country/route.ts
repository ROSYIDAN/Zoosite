import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { auth } from "@/auth";
import { userService } from "@/services/user.service";
import { updateCountrySchema } from "@/lib/validations/user.schema";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateCountrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const updatedUser = await userService.updateCountry(session.user.id, parsed.data);
    return NextResponse.json({
      message: "Country updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return handleError(error);
  }
}