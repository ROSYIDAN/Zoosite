import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const images = await prisma.animals_image.findMany({
    take: 50
  })
  console.log(JSON.stringify(images, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
