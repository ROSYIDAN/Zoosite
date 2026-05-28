import { prisma } from '../src/lib/prisma';
import { checkLocalImageExists } from '../src/lib/image-utils';
import { IMAGES_DIR, SUPPORTED_EXTENSIONS } from '../src/lib/constants';
import path from 'path';
import fs from 'fs/promises';

async function main() {
  const slug = 'northern-cardinal';
  console.log(`Checking animal with slug: ${slug}`);
  
  const animal = await prisma.animals.findUnique({
    where: { canonical_slug: slug },
    include: {
      animal_images: true
    }
  });

  if (!animal) {
    console.log('Animal not found in DB!');
    return;
  }

  console.log('Animal Record:', JSON.stringify(animal, null, 2));

  const localExists = await checkLocalImageExists(animal.id);
  console.log(`Local image file exists: ${localExists}`);

  if (localExists) {
    for (const ext of SUPPORTED_EXTENSIONS) {
      const filePath = path.join(IMAGES_DIR, `${animal.id}${ext}`);
      try {
        await fs.access(filePath);
        console.log(`Found file path: ${filePath}`);
      } catch {}
    }
  } else {
    console.log(`Looking in directory: ${IMAGES_DIR} for any file named ${animal.id}.*`);
    try {
      const files = await fs.readdir(IMAGES_DIR);
      const matches = files.filter(f => f.startsWith(animal.id));
      console.log(`Matches in directory:`, matches);
    } catch (err: any) {
      console.log(`Error reading directory: ${err.message}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
