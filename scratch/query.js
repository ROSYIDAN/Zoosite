const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`
    SELECT DISTINCT family AS value
    FROM animals
    WHERE family IS NOT NULL AND family != '' AND class_id = 'c5229dfe-a766-4b3c-a16e-b9931705216b'::uuid AND ordo ILIKE 'Carnivore'
    ORDER BY value ASC;
  `;
  console.log('Reptile Carnivore Families:', result);
  await prisma.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
