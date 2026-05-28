
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    const classes = await prisma.animal_class.findMany({
      select: { id: true, name: true },
      take: 1
    });
    console.log("Success! Found classes:", classes);
  } catch (error) {
    console.error("Failed to connect:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
