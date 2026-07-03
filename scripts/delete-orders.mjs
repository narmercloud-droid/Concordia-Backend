import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";

import { deleteOrderCompletely } from "../dist/services/order/orderDeletion.service.js";

import { reconcileAllBranchCustomers } from "../dist/services/customer/branchCustomer.service.js";



dotenv.config();



const prisma = new PrismaClient();



const explicitIds = [

  "8d36d100-b470-41e1-85e4-cf924df8cd42",

  "fd58fab1-4ffc-4c5f-a054-2dac296e8474",

  "9d3af3c2-b0b7-41f1-a232-08f8b2101193"

];



async function findHalloOrder() {

  return prisma.order.findFirst({

    where: {

      OR: [

        {

          customerName: { contains: "hallo", mode: "insensitive" },

          customerPhone: { contains: "23444555555" }

        },

        { customerPhone: "23444555555" },

        { customerPhone: { contains: "23444555555" } }

      ]

    },

    select: { id: true, customerName: true, customerPhone: true, createdAt: true }

  });

}



async function main() {

  const hallo = await findHalloOrder();

  const ids = new Set(explicitIds);

  if (hallo) {

    ids.add(hallo.id);

    console.log(

      `Found hallo order: ${hallo.id} | ${hallo.customerName} | ${hallo.customerPhone} | ${hallo.createdAt.toISOString()}`

    );

  } else {

    console.log("No order found matching hallo / 23444555555");

  }



  let deleted = 0;

  for (const id of ids) {

    const result = await deleteOrderCompletely(id);

    if (result.deleted) {

      deleted += 1;

      console.log(`Deleted: ${id}`);

    } else {

      console.log(`Skip (not found): ${id}`);

    }

  }



  if (deleted > 0) {

    const reconciled = await reconcileAllBranchCustomers();

    console.log(`Reconciled ${reconciled.updated} branch customer record(s).`);

  }

}



main()

  .catch((err) => {

    console.error(err);

    process.exit(1);

  })

  .finally(async () => {

    await prisma.$disconnect();

  });

