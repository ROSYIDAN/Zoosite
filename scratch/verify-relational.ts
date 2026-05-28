
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function verifyRelationalData() {
  const animalId = "9bfa5c8a-a4e0-47f3-b108-8bd79fe22ca6";
  
  const animal = await prisma.animals.findUnique({
    where: { id: animalId },
    include: {
      animal_distributions: {
        include: { countries: true }
      },
      animal_environment: {
        include: { habitat: true }
      }
    }
  });

  console.log(JSON.stringify(animal, null, 2));
  await prisma.$disconnect();
}

verifyRelationalData();
