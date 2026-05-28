const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const data = await prisma.dataset_animals.findMany({
    take: 5,
    select: { animal_name: true, diet: true }
  });
  console.log(JSON.stringify(data, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
