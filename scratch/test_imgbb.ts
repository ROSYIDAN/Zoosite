import { prisma } from '../src/lib/prisma';
import { animalService } from '../src/services/animal.service';

async function main() {
  // Find an animal ID
  const animal = await prisma.animals.findFirst({
    select: { id: true, animal_name: true }
  });

  if (!animal) {
    console.log('No animals found in DB.');
    return;
  }

  console.log(`Testing with animal: ${animal.animal_name} (${animal.id})`);

  try {
    const url = await animalService.getImgbbUrl(animal.id);
    console.log(`SUCCESS! ImgBB URL: ${url}`);
  } catch (error) {
    console.error('FAILED to get ImgBB URL:', error);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
