import prisma from '../src/lib/prisma';

async function main() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Project" ADD COLUMN "actionText" TEXT;`);
    console.log('Added actionText');
  } catch(e) {
    console.log(e);
  }
  
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Project" ADD COLUMN "actionUrl" TEXT;`);
    console.log('Added actionUrl');
  } catch(e) {
    console.log(e);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
