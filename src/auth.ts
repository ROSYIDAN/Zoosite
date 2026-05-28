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
