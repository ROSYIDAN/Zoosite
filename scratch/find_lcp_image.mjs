import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Let's search animal_images
  const animalImages = await prisma.animal_images.findMany({
    where: {
      image_url: {
        contains: '1bf4e79ab7e2'
      }
    },
    include: {
      animals: true
    }
  })
  console.log('Animal images matching:', animalImages)

  // Let's also check regions or other tables
  const regions = await prisma.regions.findMany({
    where: {
      imageurl: {
        contains: '1bf4e79ab7e2'
      }
    }
  })
  console.log('Regions matching:', regions)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
