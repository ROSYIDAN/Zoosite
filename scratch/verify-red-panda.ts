
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function verifyRedPanda() {
  const animalId = "db04f89d-c5fa-46fb-9470-92261edddc1a";
  
  const animal = await prisma.animals.findUnique({
    where: { id: animalId },
    include: {
      animal_descriptions: true,
      animal_images: true,
      dataset_animals: true,
      tags: true
    }
  });

  console.log(JSON.stringify(animal, null, 2));
  await prisma.$disconnect();
}

verifyRedPanda();
