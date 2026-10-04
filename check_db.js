const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
  try { 
    const res = await prisma.$queryRaw`SELECT enum_range(NULL::"CourseCategory")`; 
    console.log('Enums in DB:', res); 
  } catch(e) { 
    console.error(e); 
  } finally { 
    await prisma.$disconnect(); 
  } 
} 
main();
