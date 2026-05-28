import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Centralized error handler for route handlers.
 * Catches AppError, Zod, and Prisma errors → returns consistent { error } response.
 */
export function handleError(error: unknown): NextResponse {
  // Known application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      { message: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: "Validation failed", details: error.issues },
      { status: 400 }
    );
  }

  // Prisma known request errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        const conflictTarget = Array.isArray(error.meta?.target)
          ? error.meta.target.join(", ")
          : undefined;
        return NextResponse.json(
          {
            message: conflictTarget
              ? `Record already exists for ${conflictTarget}`
              : "Record already exists",
            code: "CONFLICT",
          },
          { status: 409 }
        );
      case "P2025":
        return NextResponse.json(
          { message: "Record not found", code: "NOT_FOUND" },
          { status: 404 }
        );
      case "P2003":
        return NextResponse.json(
          { message: "Invalid reference", code: "BAD_REFERENCE" },
          { status: 400 }
        );
      default:
        break;
    }
  }

  // Unexpected errors
  console.error("Unhandled error:", error);
  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 }
  );
}
