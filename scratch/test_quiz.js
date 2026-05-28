const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 1. Create a sample EASY SINGLE_PICK_LIST question
  const question = await prisma.quiz_questions.create({
    data: {
      prompt: "Which of these animals is a Mammal?",
      level: "EASY",
      pattern: "SINGLE_PICK_LIST",
      options: {
        create: [
          { label: "Lion", is_correct: true },
          { label: "Great White Shark", is_correct: false },
          { label: "Bald Eagle", is_correct: false },
          { label: "King Cobra", is_correct: false },
        ],
      },
    },
    include: { options: true },
  });

  console.log("✅ Created question:", question.id);
  console.log("   Prompt:", question.prompt);
  console.log("   Level:", question.level);
  console.log("   Pattern:", question.pattern);
  console.log("   Options:");
  question.options.forEach((opt) => {
    const mark = opt.is_correct ? "✅" : "❌";
    console.log(`     ${mark} ${opt.label} (${opt.id})`);
  });

  // 2. Simulate verifying a correct answer
  const correctOpt = question.options.find((o) => o.is_correct);
  const correctIds = await prisma.quiz_options.findMany({
    where: { question_id: question.id, is_correct: true },
    select: { id: true },
  });

  const userSelected = [correctOpt.id];
  const correctSet = new Set(correctIds.map((o) => o.id));
  const selectedSet = new Set(userSelected);

  const isCorrect =
    selectedSet.size === correctSet.size &&
    [...selectedSet].every((id) => correctSet.has(id));

  console.log("\n🧪 Verification test:");
  console.log("   User selected:", correctOpt.label);
  console.log("   Result:", isCorrect ? "✅ CORRECT" : "❌ WRONG");

  // 3. Clean up test data
  await prisma.quiz_questions.delete({ where: { id: question.id } });
  console.log("\n🗑️  Test data cleaned up.");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
