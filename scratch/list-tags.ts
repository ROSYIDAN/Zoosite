
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const tags = await prisma.tags.findMany();
  console.log(JSON.stringify(tags, null, 2));
  await prisma.$disconnect();
}

main();
