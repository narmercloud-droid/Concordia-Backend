import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const branchSeeds = [
  {
    branch_code: "BR01",
    settings: {
      terminalEnabled: true,
      defaultPrintLayout: "receipt",
      allowRemoteOrders: true,
    },
    terminals: [
      { name: "Front Desk", status: "active" },
      { name: "Kitchen", status: "active" },
    ],
  },
  {
    branch_code: "BR02",
    settings: {
      terminalEnabled: true,
      defaultPrintLayout: "receipt",
      allowRemoteOrders: false,
    },
    terminals: [
      { name: "Terminal 1", status: "active" },
    ],
  },
];

export async function seedBranchSettings() {
  console.log("🌱 Seeding branch settings and terminals...");

  for (const branchSeed of branchSeeds) {
    const branch = await prisma.branch.findUnique({
      where: { branch_code: branchSeed.branch_code },
    });

    if (!branch) {
      console.warn(`⚠️ Branch not found: ${branchSeed.branch_code}. Skipping.`);
      continue;
    }

    const existingSettings = await prisma.branchSettings.findUnique({
      where: { branch_id: branch.id },
    });

    if (!existingSettings) {
      await prisma.branchSettings.create({
        data: {
          branch_id: branch.id,
          config: branchSeed.settings,
        },
      });
      console.log(`✅ Seeded BranchSettings for branch ${branchSeed.branch_code}.`);
    } else {
      console.log(`ℹ️ BranchSettings already exists for branch ${branchSeed.branch_code}.`);
    }

    if (branchSeed.terminals?.length) {
      for (const terminalSeed of branchSeed.terminals) {
        const existingTerminal = await prisma.branchTerminal.findFirst({
          where: {
            branch_id: branch.id,
            name: terminalSeed.name,
          },
        });

        if (!existingTerminal) {
          await prisma.branchTerminal.create({
            data: {
              branch_id: branch.id,
              name: terminalSeed.name,
              status: terminalSeed.status ?? "active",
              is_online: false,
              last_seen: null,
            },
          });
          console.log(`✅ Created BranchTerminal ${terminalSeed.name} for branch ${branchSeed.branch_code}.`);
        } else {
          console.log(`ℹ️ BranchTerminal already exists: ${terminalSeed.name} for branch ${branchSeed.branch_code}.`);
        }
      }
    }
  }

  console.log("🌱 Branch settings seeding complete.");
}

if (require.main === module) {
  seedBranchSettings()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
