import { PrismaClient } from "@prisma/client";
import { getBranchItemForCustomer } from "../src/services/customer/branchMenu.service.ts";

const branchId = process.argv[2] || "concordia-straelen";
const itemId = Number(process.argv[3] || 20000);
const prisma = new PrismaClient();

const item = await getBranchItemForCustomer(branchId, itemId);
console.log(JSON.stringify(item, null, 2));

await prisma.$disconnect();
