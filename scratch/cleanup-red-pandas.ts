
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function cleanupRedPandas() {
  try {
    const searchPattern = "%Red Panda%";

    console.log(`Cleaning up animals containing: "${searchPattern}"...`);

    // Using raw SQL or contains for more flexibility
    const deleted = await prisma.animals.deleteMany({
      where: {
        animal_name: {
          contains: "Red Panda",
          mode: "insensitive"
        }
      }
    });

    console.log(`Successfully deleted ${deleted.count} animal records.`);
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupRedPandas();
