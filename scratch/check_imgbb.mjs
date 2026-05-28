import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const images = await prisma.animals_image.findMany()
  const imgbb = images.filter(img => img.imageurl && img.imageurl.includes('ibb.co'))
  console.log(`Found ${imgbb.length} ImgBB URLs out of ${images.length} total images.`)
  if (imgbb.length > 0) {
    console.log('Sample:', imgbb.slice(0, 5))
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
