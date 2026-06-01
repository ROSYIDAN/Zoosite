import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { UserRole } from "@prisma/client";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? UserRole.USER;
        token.image_position = user.image_position ?? "50% 50%";
        token.image_scale = user.image_scale ?? 1.0;
      }
      if (trigger === "update" && session) {
        if (session.image !== undefined) token.picture = session.image;
        if (session.image_position !== undefined) token.image_position = session.image_position;
        if (session.image_scale !== undefined) token.image_scale = session.image_scale;
        if (session.name !== undefined) token.name = session.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = token.role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.USER;
        session.user.image_position = typeof token.image_position === "string" ? token.image_position : "50% 50%";
        session.user.image_scale = typeof token.image_scale === "number" ? token.image_scale : 1.0;
        if (token.picture) {
          session.user.image = token.picture;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
