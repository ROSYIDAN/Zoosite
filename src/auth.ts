import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { UserRole } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      // First run the base jwt mapping from authConfig
      token = await authConfig.callbacks.jwt({ token, user, trigger, session } as any);

      // Fetch latest from DB to prevent stale session values (runs on sign-in and reloads)
      if (trigger !== "update" && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              image: true,
              image_position: true,
              image_scale: true,
              name: true,
              role: true,
              country_id: true,
            },
          });
          if (dbUser) {
            token.picture = dbUser.image;
            token.image_position = dbUser.image_position ?? "50% 50%";
            token.image_scale = dbUser.image_scale ?? 1.0;
            token.name = dbUser.name;
            token.role = dbUser.role;
            token.countryId = dbUser.country_id;
          }
        } catch (err) {
          console.error("Failed to sync session with database:", err);
        }
      }
      return token;
    },
  },
  providers: [
    ...authConfig.providers,
    Credentials({
      id: "developer-bypass",
      name: "Developer Bypass",
      credentials: {
        passcode: { label: "Passcode", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.passcode === "zoo-admin") {
          const devAdminId = "43a886b6-e274-4b6a-93a0-8bf135ea244c";
          try {
            const devAdmin = await prisma.user.upsert({
              where: { id: devAdminId },
              update: {
                role: UserRole.ADMIN,
              },
              create: {
                id: devAdminId,
                name: "Developer Admin",
                email: "dev@zoosite.local",
                role: UserRole.ADMIN,
              },
            });
            return {
              id: devAdmin.id,
              name: devAdmin.name,
              email: devAdmin.email,
              role: devAdmin.role,
            };
          } catch (err) {
            console.error("Failed to upsert developer admin bypass user:", err);
            return {
              id: devAdminId,
              name: "Developer Admin",
              email: "dev@zoosite.local",
              role: UserRole.ADMIN,
            };
          }
        }
        return null;
      },
    }),
  ],
});
