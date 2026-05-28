const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("--------------------------------------------------");
  console.log("🧪 ZooSite Synonym/Nickname Auto-Populator Started");
  console.log("--------------------------------------------------");

  const animals = await prisma.animals.findMany({
    select: {
      id: true,
      animal_name: true,
      family: true,
    },
  });

  console.log(`Found ${animals.length} animals in the database.\n`);

  let count = 0;
  for (const animal of animals) {
    if (!animal.animal_name) continue;

    const originalName = animal.animal_name.trim();
    const cleanName = originalName.toLowerCase();
    const words = cleanName.split(/\s+/);
    
    // Start with a set to guarantee unique elements
    const synonyms = new Set();

    // 1. Add the base name itself
    synonyms.add(cleanName);

    // 2. Add individual words or groups
    if (words.length > 1) {
      // Add the primary keyword (last word) e.g. "African Lion" -> "lion"
      const lastWord = words[words.length - 1];
      synonyms.add(lastWord);

      // Add two-word suffixes if name is long, e.g. "African Wild Dog" -> "wild dog"
      if (words.length > 2) {
        const lastTwoWords = `${words[words.length - 2]} ${words[words.length - 1]}`;
        synonyms.add(lastTwoWords);
      }
    }

    // 3. Custom high-quality taxonomy synonyms maps
    const nameLower = cleanName;
    
    // Big Cats / Felines
    if (
      nameLower.includes("lion") || 
      nameLower.includes("tiger") || 
      nameLower.includes("leopard") || 
      nameLower.includes("cheetah") || 
      nameLower.includes("jaguar") || 
      nameLower.includes("cougar") || 
      nameLower.includes("puma") || 
      nameLower.includes("lynx")
    ) {
      synonyms.add("big cat");
      synonyms.add("feline");
    }

    // Canines / Wolves / Dogs
    if (nameLower.includes("wolf") || nameLower.includes("dog") || nameLower.includes("fox") || nameLower.includes("jackal") || nameLower.includes("coyote")) {
      synonyms.add("canine");
    }

    // Bears
    if (nameLower.includes("bear")) {
      synonyms.add("ursine");
    }

    // Specific Multi-Nickname Overrides
    if (nameLower.includes("cougar") || nameLower.includes("mountain lion") || nameLower.includes("puma")) {
      synonyms.add("puma");
      synonyms.add("mountain lion");
      synonyms.add("cougar");
      synonyms.add("catamount");
      synonyms.add("panther");
    }
    
    if (nameLower.includes("orca") || nameLower.includes("killer whale")) {
      synonyms.add("orca");
      synonyms.add("killer whale");
      synonyms.add("blackfish");
    }

    if (nameLower.includes("red panda")) {
      synonyms.add("firefox");
      synonyms.add("lesser panda");
    }

    if (nameLower.includes("platypus")) {
      synonyms.add("duckbill");
      synonyms.add("watermole");
    }

    // Convert Set back to comma-separated string
    const synonymsString = Array.from(synonyms).join(", ");

    // Update the record in the database
    await prisma.animals.update({
      where: { id: animal.id },
      data: { synonyms: synonymsString },
    });

    console.log(`✅ Updated "${originalName}": [${synonymsString}]`);
    count++;
  }

  console.log("\n--------------------------------------------------");
  console.log(`🎉 Success! Auto-populated synonyms for ${count} animals.`);
  console.log("--------------------------------------------------");
}

main()
  .catch((err) => {
    console.error("\n❌ Error populating synonyms:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
