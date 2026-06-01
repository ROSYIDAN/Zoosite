import { UserRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      image_position?: string | null;
      image_scale?: number | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    image_position?: string | null;
    image_scale?: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    image_position?: string | null;
    image_scale?: number | null;
  }
}
