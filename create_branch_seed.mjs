import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main(){
  const id = 'test-branch-1';
  const existing = await prisma.branch.findUnique({ where: { id } });
  if(existing){
    console.log('Branch already exists:', existing.id);
    process.exit(0);
  }
  const created = await prisma.branch.create({ data: { id, name: 'Test Branch', printerType: 'virtual' } });
  console.log('Created branch:', created.id);
  await prisma.$disconnect();
}

main().catch(e=>{ console.error(e); process.exit(1); });
