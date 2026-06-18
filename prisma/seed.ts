import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = ["Divan", "Stol", "Stul", "Shkaf", "Krovat", "Javon", "Oshxona", "Boshqa"];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Kategoriyalar qo'shildi");
}

main().finally(() => prisma.$disconnect());
