
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const classes = await prisma.animal_class.findMany();
  console.log(JSON.stringify(classes, null, 2));
  await prisma.$disconnect();
}

main();
