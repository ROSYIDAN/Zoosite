import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const images = await prisma.animals_image.findMany()
  const imgbb = images.filter(img => img.imageurl && (img.imageurl.includes('ibb.co') || img.imageurl.includes('i.ibb.co.com')))
  console.log(`Found ${imgbb.length} ImgBB URLs out of ${images.length} total images.`)
  if (imgbb.length > 0) {
    console.log('Sample:', imgbb)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
