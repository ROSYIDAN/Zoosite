import { supportSchema } from "@/lib/validations/support.schema";
import { NextResponse } from "next/server";

/**
 * POST /api/support
 * Handles help center support message submissions.
 * Validates with Zod and logs the message as a simulated email transmission.
 * Following BE Law: Thin controller, validates input, returns standardized response.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = supportSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: parsed.error.issues 
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Simulate sending email to administration by logging to console
    console.log("\n==================================================");
    console.log("📨 SIMULATED EMAIL DISPATCH (SUPPORT TICKET)");
    console.log(`TIMESTAMP : ${new Date().toISOString()}`);
    console.log(`FROM      : ${name} <${email}>`);
    console.log(`SUBJECT   : ${subject}`);
    console.log("MESSAGE   :");
    console.log(message);
    console.log("==================================================\n");

    return NextResponse.json(
      { data: { success: true } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Support submission failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
