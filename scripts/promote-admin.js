const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
  console.error("Please provide an email address. Example:\nrtk node scripts/promote-admin.js your-google-email@gmail.com");
  process.exit(1);
}

async function main() {
  const normalizedEmail = email.toLowerCase().trim();

  // Try to find the user in the database
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (!user) {
    // If the user doesn't exist yet, we pre-create their record.
    // When they sign in with Google, NextAuth's PrismaAdapter matches the email and inherits the pre-set ADMIN role.
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        role: 'ADMIN',
        name: normalizedEmail.split('@')[0]
      }
    });
    console.log(`\n🎉 Success! Pre-created user profile and promoted "${normalizedEmail}" to ADMIN.`);
    console.log(`Now, when you log in with this Google account, you will automatically be recognized as an ADMIN!`);
  } else {
    // If the user already exists, update their role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { email: normalizedEmail },
      data: { role: 'ADMIN' }
    });
    console.log(`\n🎉 Success! Promoted existing user "${normalizedEmail}" to ADMIN.`);
  }
}

main()
  .catch((err) => {
    console.error("\n❌ Error promoting user:", err.message);
  })
  .finally(() => prisma.$disconnect());
