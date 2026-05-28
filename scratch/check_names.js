const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const samples = await prisma.animal_names.findMany({
    take: 10,
    where: {
      scientific_name: { not: null }
    }
  });
  console.log(JSON.stringify(samples, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
